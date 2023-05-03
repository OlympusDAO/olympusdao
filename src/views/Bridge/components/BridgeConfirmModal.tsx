import { Box, Typography } from "@mui/material";
import { Icon, InfoNotification, Modal, OHMTokenProps, PrimaryButton, Token } from "@olympusdao/component-library";
import { UseMutationResult } from "@tanstack/react-query";
import { ContractReceipt } from "ethers";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { BRIDGE_CHAINS, MINTER_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { IBridgeOhm, useEstimateSendFee } from "src/hooks/useBridging";
import { EthersError } from "src/lib/EthersTypes";
import { BridgeFees } from "src/views/Bridge/components/BridgeFees";
import { useAccount, useNetwork } from "wagmi";

export const BridgeConfirmModal = (props: {
  isOpen: boolean;
  handleConfirmClose: () => void;
  amountExceedsBalance: boolean;
  amount: string;
  bridgeMutation: UseMutationResult<ContractReceipt, EthersError, IBridgeOhm, unknown>;
  destinationChainId: number;
}) => {
  const { chain = { id: 1 } } = useNetwork();

  const { address } = useAccount();
  const { data: fee } = useEstimateSendFee({
    destinationChainId: props.destinationChainId,
    recipientAddress: address as string,
    amount: props.amount,
  });

  return (
    <Modal
      data-testid="bridge-confirmation-modal"
      maxWidth="476px"
      headerContent={
        <Box display="flex" flexDirection="row" gap={1} alignItems="center">
          <Icon name="bridge" />
          <Typography variant="body1" sx={{ fontSize: "15px", fontWeight: 500 }}>{`Confirm Bridging`}</Typography>
        </Box>
      }
      open={props.isOpen}
      onClose={props.handleConfirmClose}
      minHeight={"100px"}
    >
      <Box display="flex" flexDirection="column">
        {props.bridgeMutation.isLoading && (
          <InfoNotification>
            Please don't close this modal until all wallet transactions are confirmed.
          </InfoNotification>
        )}

        <Box id="bridge-metrics" display="flex" flexDirection="row" justifyContent="space-around" alignItems="center">
          <Box display="flex" flexDirection="column">
            <BridgeMetric amount={props.amount} chainId={chain.id} />
          </Box>
          <Icon sx={{ transform: "rotate(-90deg)" }} name="caret-down" />
          <Box display="flex" flexDirection="column">
            <BridgeMetric amount={props.amount} chainId={props.destinationChainId} />
          </Box>
        </Box>
        {fee && (
          <Box id="bridge-fee" display="flex" flexDirection="column" justifyContent="center" width="100%">
            <Box sx={{ marginTop: "1rem" }}>
              <hr style={{ borderWidth: "0.5px" }} />
            </Box>
            <BridgeFees amount={props.amount} receivingChain={props.destinationChainId} />
          </Box>
        )}

        <Box id="bridge-button" sx={{ marginTop: "2rem" }}>
          <WalletConnectedGuard fullWidth>
            <TokenAllowanceGuard
              tokenAddressMap={OHM_ADDRESSES}
              spenderAddressMap={MINTER_ADDRESSES}
              approvalText={`Approve OHM for Bridging`}
              message={
                <>
                  First time bridging <b>OHM</b>? <br /> Please approve Olympus DAO to use your <b>OHM</b> for bridging.
                </>
              }
            >
              <>
                <PrimaryButton
                  data-testid="submit-modal-button"
                  loading={props.bridgeMutation.isLoading}
                  fullWidth
                  disabled={
                    props.bridgeMutation.isLoading ||
                    !props.amount ||
                    props.amountExceedsBalance ||
                    parseFloat(props.amount) === 0
                  }
                  onClick={() =>
                    props.bridgeMutation.mutate({
                      destinationChainId: props.destinationChainId,
                      recipientAddress: address as string,
                      amount: props.amount,
                    })
                  }
                >
                  {props.amountExceedsBalance
                    ? "Amount exceeds balance"
                    : !props.amount || parseFloat(props.amount) === 0
                    ? "Enter an amount"
                    : props.bridgeMutation.isLoading
                    ? "Confirming Bridging in your wallet"
                    : `Bridge OHM to ${BRIDGE_CHAINS[props.destinationChainId as keyof typeof BRIDGE_CHAINS].name}`}
                </PrimaryButton>
              </>
            </TokenAllowanceGuard>
          </WalletConnectedGuard>
        </Box>
      </Box>
    </Modal>
  );
};

const BridgeMetric = ({ amount, chainId }: { amount: string; chainId: number }) => {
  return (
    <>
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={1}>
        <Typography fontSize="18px" lineHeight="28px" color="textSecondary">
          {BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS].name}
        </Typography>
        <Token
          name={BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS].token as OHMTokenProps["name"]}
          sx={{ width: "28px", height: "28px" }}
        />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography fontSize="24px" fontWeight="700" lineHeight="33px">
          {new DecimalBigNumber(amount).toString({ decimals: 4, format: true, trim: true })}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography>{`OHM`}</Typography>
      </Box>
    </>
  );
};
