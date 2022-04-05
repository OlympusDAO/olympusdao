import { BigNumber, ethers } from "ethers";
import { GOHM_ADDRESSES } from "src/constants/addresses";

import { abi as gOHM } from "../abi/gOHM.json";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { addresses } from "../constants";
import { IBaseAddressAsyncThunk, IBaseAddressRecipientAsyncThunk } from "../slices/interfaces";

// Calculate total amount redeemed by a user + their current redeemable balance
/**
 * Calculates the total amount redeemed by a user + their current redeemable balance
 * @param address Current user's Ethereum address
 * @param networkID ID number of the network the user is currently connected to
 * @param provider Ethereum network provider object
 * @returns BigNumber representation of the sOHM value of the total amount redeemed by a user
 *          plus their current redeemable balance
 */
export const getTotalDonated = async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
  if (!addresses[networkID] || !addresses[networkID].GIVING_ADDRESS) {
    console.log("No giving contract on chain ID " + networkID);
    return "0";
  }

  const gohmContract = new ethers.Contract(
    GOHM_ADDRESSES[networkID as keyof typeof GOHM_ADDRESSES] as string,
    gOHM,
    provider,
  );

  // Addresses in EVM events are zero padded out to 32 characters and are lower case
  // This matches our inputs with the data we expect to receive from Ethereum
  const zeroPadAddress = ethers.utils.hexZeroPad(address.toLowerCase(), 32);

  // Creates an event filter to look at all events from the first block ever to the current block
  // and identify events that match the Redeemed hash with our user
  const filter = {
    address: addresses[networkID].GIVING_ADDRESS,
    fromBlock: 1,
    toBlock: "latest",
    topics: [ethers.utils.id("Redeemed(address,uint256)"), zeroPadAddress], // hash identifying Redeemed event
  };

  // using the filter, get all events
  const events = await provider.getLogs(filter);

  let totalRedeemed = BigNumber.from("0");

  // Sum up the total amount redeemed by the user thus far
  for (let i = 0; i < events.length; i++) {
    totalRedeemed = totalRedeemed.add(events[i].data);
  }

  // Pull user's redeemable balance and add to amount redeemed
  const givingContract = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, provider);
  const redeemableBalance = await givingContract.totalRedeemableBalance(address);

  const totalDonated = totalRedeemed.add(redeemableBalance);
  const totalDonatedAsSohm = await gohmContract.balanceFrom(totalDonated);

  return ethers.utils.formatUnits(totalDonatedAsSohm, "gwei");
};

/**
 * Calculate total yield sent from a given user to a given recipient
 * @param address Current user's Ethereum address
 * @param recipient Address of the donation target of the current user
 * @param networkID  ID number of the network the user is currently connected to
 * @param provider Ethereum network provider object
 * @returns BigNumber representing the amount of gOHM donated to the recipient
 */
export const getTotalYieldSent = async ({
  address,
  recipient,
  networkID,
  provider,
}: IBaseAddressRecipientAsyncThunk) => {
  if (!addresses[networkID] || !addresses[networkID].GIVING_ADDRESS || networkID !== 1) {
    console.log("No giving contract on chain ID " + networkID);
    return BigNumber.from("0");
  }

  const givingContract = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, provider);

  // Get deposit ID
  const depositIds = await givingContract.getDepositorIds(address);
  let recipientId = 0;

  for (let i = 0; i < depositIds.length; i++) {
    // Look up recipient address for the given deposit ID
    const currRecipient = await givingContract.recipientLookup(depositIds[i]);

    // If the looked up recipient matches the passed in recipient, capture this deposit ID
    if (currRecipient.toLowerCase() === recipient.toLowerCase()) {
      recipientId = depositIds[i];
      break;
    }
  }

  // Addresses in EVM events are zero padded out to 32 characters and are lower case
  // This matches our inputs with the data we expect to receive from Ethereum
  const zeroPadAddress = ethers.utils.hexZeroPad(address.toLowerCase(), 32);
  const zeroPadRecipientAddress = ethers.utils.hexZeroPad(recipient.toLowerCase(), 32);

  // Creates an event filter to look at all events from the first block ever to the current block
  // and identify events that match the Donated event hash with our user and recipient
  const filter = {
    address: addresses[networkID].GIVING_ADDRESS,
    fromBlock: 1,
    toBlock: "latest",
    topics: [ethers.utils.id("Donated(address,address,uint256)"), zeroPadAddress, zeroPadRecipientAddress], // hash identifying Redeemed event
  };

  // using the filter, get all events
  const events = await provider.getLogs(filter);

  let totalYield = BigNumber.from("0");

  // Sum up the total yield sent by the user thus far
  for (let i = 0; i < events.length; i++) {
    totalYield = totalYield.add(events[i].data);
  }

  // Pull the current donated yield that has yet to be redeemed and add to yield that has been redeemed
  const outstandingYield = await givingContract.redeemableBalance(recipientId);

  return totalYield.add(outstandingYield);
};
