import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractReceipt, ethers } from "ethers";
import toast from "react-hot-toast";
import { CROSS_CHAIN_BRIDGE_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { CROSS_CHAIN_BRIDGE_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { balanceQueryKey, useOhmBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { EthersError } from "src/lib/EthersTypes";
import { BridgeReceivedEvent, BridgeTransferredEvent } from "src/typechain/CrossChainBridge";
import { layerZeroChainIdsFromEVM, useBridgeableTestableNetwork } from "src/views/Bridge/helpers";
import { useAccount, useBlockNumber, useNetwork, useSigner } from "wagmi";

export interface IHistoryTx {
  timestamp: string;
  amount: string;
  transactions: {
    sendingChain: string;
    receivingChain?: string;
  };
  confirmations: string;
}

export interface IBridgeOhm {
  destinationChainId: number;
  recipientAddress: string;
  amount: string;
}

export interface IBridgeFee {
  nativeFee: DecimalBigNumber;
  zroFee: DecimalBigNumber;
}

export const useEstimateSendFee = ({ destinationChainId, recipientAddress, amount }: IBridgeOhm) => {
  const client = useQueryClient();
  const { address = "" } = useAccount();
  const { chain = { id: 1, name: "Mainnet" } } = useNetwork();
  const networks = useTestableNetworks();
  console.log("chsoen chain", chain.id, destinationChainId);

  return useQuery<IBridgeFee, Error>(
    ["estimateSendFee", destinationChainId, amount],
    async () => {
      const destinationExists =
        !!CROSS_CHAIN_BRIDGE_ADDRESSES[destinationChainId as keyof typeof CROSS_CHAIN_BRIDGE_ADDRESSES];
      if (!destinationExists) throw new Error("Bridging to the chosen chain is not enabled");

      const bridgeContract = CROSS_CHAIN_BRIDGE_CONTRACT.getEthersContract(networks.MAINNET);
      if (!bridgeContract) throw new Error("Bridging doesn't exist on current network. Please switch networks.");
      if (Number(amount) === 0) throw new Error("You cannot bridge 0 OHM");
      const decimalAmount = new DecimalBigNumber(amount, 9);
      console.log("decimalAmount", decimalAmount);
      const layerZeroChainId = layerZeroChainIdsFromEVM({ evmChainId: destinationChainId });
      const fee = await bridgeContract.estimateSendFee(
        String(layerZeroChainId),
        recipientAddress,
        decimalAmount.toBigNumber(),
        "0x",
      );

      console.log("qfee", fee);
      return {
        nativeFee: new DecimalBigNumber(fee.nativeFee, 18),
        zroFee: new DecimalBigNumber(fee.zroFee, 18),
      };
    },
    {
      enabled: !!chain && Number(amount) > 0,
    },
  );
};

export const useBridgeOhm = () => {
  const client = useQueryClient();

  const { address = "" } = useAccount();
  const { chain = { id: 1, name: "Mainnet" } } = useNetwork();
  const { data: signer } = useSigner();
  const network = useBridgeableTestableNetwork();
  const bridgeContract = CROSS_CHAIN_BRIDGE_CONTRACT.getEthersContract(network);
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useOhmBalance()[network];

  return useMutation<ContractReceipt, EthersError, IBridgeOhm>(
    async ({ destinationChainId, recipientAddress, amount }: IBridgeOhm) => {
      const destinationExists =
        !!CROSS_CHAIN_BRIDGE_ADDRESSES[destinationChainId as keyof typeof CROSS_CHAIN_BRIDGE_ADDRESSES];
      if (!destinationExists) throw new Error("Bridging to the chosen chain is not enabled");
      if (!bridgeContract) throw new Error("Bridging doesn't exist on current network. Please switch networks.");
      if (Number(amount) === 0) throw new Error("You cannot bridge 0 OHM");
      if (!ohmBalance) throw new Error("Something went wrong. Please refresh your screen & try again.");
      const decimalAmount = new DecimalBigNumber(amount, 9);
      if (ohmBalance.lt(decimalAmount))
        throw new Error(`You cannot bridge more than your OHM balance on ${chain.name}`);
      if (!signer) throw new Error("No signer");

      const layerZeroChainId = layerZeroChainIdsFromEVM({ evmChainId: destinationChainId });
      const fee = await bridgeContract.estimateSendFee(
        String(layerZeroChainId),
        recipientAddress,
        decimalAmount.toBigNumber(),
        "0x",
      );
      console.log("fee", fee);
      const transaction = await bridgeContract
        .connect(signer)
        .sendOhm(String(layerZeroChainId), recipientAddress, decimalAmount.toBigNumber(), { value: fee.nativeFee });

      return transaction.wait();
    },
    {
      onError: (error: any) => toast.error("error" in error ? error.error.message : error.message),
      onSuccess: async () => {
        toast.success("Successfully bridged");
        await client.refetchQueries([balanceQueryKey(address, OHM_ADDRESSES, chain.id)]);
      },
    },
  );
};

export const useGetBridgeTransferredEvents = () => {
  const { chain = { id: 1 } } = useNetwork();
  const { address } = useAccount();
  // const archiveProvider = useArchiveNodeProvider(chain?.id);
  const contract = CROSS_CHAIN_BRIDGE_CONTRACT.getEthersContract(chain.id);
  // const provider = Providers.getStaticProvider(chain.id);
  const { data: signer } = useSigner();
  const { data: blockNumber, isError: blockNumberError } = useBlockNumber({ chainId: chain.id });
  return useQuery<IHistoryTx[], Error>(
    ["GetBridgingEvents", chain.id, address],
    async () => {
      // using EVENTS
      if (!address) throw new Error("Cannot get transfer events without a connected wallet");
      if (!signer) throw new Error("Cannot get transfer events without a signer");
      // const sendOhmEvents = await contract.queryFilter(contract.filters.BridgeTransferred(address));
      // const receiveOhmEvents = await contract.queryFilter(contract.filters.BridgeReceived(address));
      const sendOhmEvents = await contract.queryFilter(contract.filters.BridgeTransferred());
      const receiveOhmEvents = await contract.queryFilter(contract.filters.BridgeReceived());
      return [
        ...sendOhmEvents
          .filter(event => event.args.sender_ === address)
          .map((event: BridgeTransferredEvent) => mapBridgeEvents(event, blockNumber)),
        ...receiveOhmEvents
          .filter(event => event.args.receiver_ === address)
          .map((event: BridgeReceivedEvent) => mapBridgeEvents(event, blockNumber)),
      ];
      // const contract = IERC20__factory.connect(OHM_ADDRESSES[chain.id as keyof typeof OHM_ADDRESSES], signer);
      // const sendOhmEvents = await contract.queryFilter(
      //   contract.filters.Transfer(address, ethers.constants.AddressZero),
      // );
      // const receiveOhmEvents = await contract.queryFilter(
      //   contract.filters.Transfer(ethers.constants.AddressZero, address),
      // );
      // return [...sendOhmEvents, ...receiveOhmEvents];
    },
    { enabled: !!chain && !!chain.id && !!contract && !!address && !!signer && (!!blockNumber || blockNumberError) },
  );
};

const mapBridgeEvents = (event: BridgeTransferredEvent | BridgeReceivedEvent, blockNumber?: number): IHistoryTx => {
  console.log("event block", event.blockNumber, blockNumber);
  const confirmations = blockNumber && blockNumber - event.blockNumber;
  return {
    timestamp: String(event.blockNumber),
    amount: ethers.utils.formatUnits(event.args.amount_, 9),
    transactions: { sendingChain: event.transactionHash },
    confirmations: confirmations ? (confirmations <= 100 ? String(confirmations) : "> 100") : "1",
  };
};
