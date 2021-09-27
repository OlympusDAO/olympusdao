import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess } from "./AccountSlice";
import { error } from "../slices/MessagesSlice";

export const ACTIONS = { STAKE: "STAKE", UNSTAKE: "UNSTAKE" };
export const TYPES = { OLD: "OLD_SOHM", NEW: "NEW_OHM" };

export const calculateAPY = createAsyncThunk("migrate/calculateAPY", async (sohmContract, stakingReward) => {
  const circSupply = await sohmContract.circulatingSupply();

  const stakingRebase = stakingReward / circSupply;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3);

  return stakingAPY;
});

export const getApproval = createAsyncThunk(
  "migrate/getApproval",
  async ({ type, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = await new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, signer);
    const oldSohmContract = await new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, ierc20Abi, signer);

    let approveTx;
    try {
      if (type === TYPES.OLD) {
        approveTx = await oldSohmContract.approve(
          addresses[networkID].OLD_STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (type === TYPES.NEW) {
        approveTx = await ohmContract.approve(
          addresses[networkID].STAKING_HELPER_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }
      const text = "Approve " + (type === TYPES.OLD ? "Unstaking" : "Staking");
      const pendingTxnType = type === TYPES.OLD ? "approve_migrate_unstaking" : "approve_migrate_staking";

      fetchPendingTxns({
        txnHash: approveTx.hash,
        text,
        type: pendingTxnType,
      }),
        await approveTx.wait();
    } catch (e) {
      dispatch(error(e.message));
      return;
    } finally {
      if (approveTx) {
        clearPendingTxn(approveTx.hash);
      }
    }

    const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await oldSohmContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        migrate: {
          stakeAllowance,
          unstakeAllowance,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "migrate/changeStake",
  async ({ action, value, provider, address, networkID }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const oldStaking = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS, OlympusStaking, signer);
    const staking = new ethers.Contract(addresses[networkID].STAKING_HELPER_ADDRESS, StakingHelper, signer);

    let stakeTx;

    try {
      if (action === ACTIONS.STAKE) {
        stakeTx = await staking.stake(ethers.utils.parseUnits(value, "gwei"));
      } else if (action === ACTIONS.UNSTAKE) {
        stakeTx = await oldStaking.unstakeOHM(ethers.utils.parseUnits(value, "gwei"));
      }
      const pendingTxnType = action === ACTIONS.STAKE ? "migrate_staking" : "migrate_unstaking";
      fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType });
      await stakeTx.wait();
    } catch (e) {
      if (e.code === -32603 && e.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(e.message));
      }
      return;
    } finally {
      if (stakeTx) {
        clearPendingTxn(stakeTx.hash);
      }
    }

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
    const sohmBalance = await sohmContract.balanceOf(address);
    const oldSohmContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);
    const oldsohmBalance = await oldSohmContract.balanceOf(address);

    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        oldsohm: ethers.utils.formatUnits(oldsohmBalance, "gwei"),
      },
    };
  },
);
