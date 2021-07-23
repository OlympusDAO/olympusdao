/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface OlympusStakingInterface extends ethers.utils.Interface {
  functions: {
    "INDEX_GONS()": FunctionFragment;
    "LPRewards()": FunctionFragment;
    "OHM()": FunctionFragment;
    "contractBalance()": FunctionFragment;
    "distributor()": FunctionFragment;
    "epoch()": FunctionFragment;
    "giveBonusToLocker(uint256)": FunctionFragment;
    "index()": FunctionFragment;
    "locker()": FunctionFragment;
    "manager()": FunctionFragment;
    "pullManagement()": FunctionFragment;
    "pushManagement(address)": FunctionFragment;
    "rebase()": FunctionFragment;
    "reclaimBonusFromLocker(uint256)": FunctionFragment;
    "renounceManagement()": FunctionFragment;
    "sOHM()": FunctionFragment;
    "setContract(uint8,address)": FunctionFragment;
    "stake(uint256,address)": FunctionFragment;
    "totalBonus()": FunctionFragment;
    "unstake(uint256,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "INDEX_GONS",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "LPRewards", values?: undefined): string;
  encodeFunctionData(functionFragment: "OHM", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "contractBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "distributor",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "epoch", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "giveBonusToLocker",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "index", values?: undefined): string;
  encodeFunctionData(functionFragment: "locker", values?: undefined): string;
  encodeFunctionData(functionFragment: "manager", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pullManagement",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pushManagement",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "rebase", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "reclaimBonusFromLocker",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceManagement",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "sOHM", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setContract",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "stake",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalBonus",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "unstake",
    values: [BigNumberish, string]
  ): string;

  decodeFunctionResult(functionFragment: "INDEX_GONS", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "LPRewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "OHM", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contractBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "epoch", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "giveBonusToLocker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "index", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "locker", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "manager", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pullManagement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pushManagement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rebase", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "reclaimBonusFromLocker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceManagement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sOHM", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "totalBonus", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unstake", data: BytesLike): Result;

  events: {
    "OwnershipPulled(address,address)": EventFragment;
    "OwnershipPushed(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipPulled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipPushed"): EventFragment;
}

export class OlympusStaking extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: OlympusStakingInterface;

  functions: {
    INDEX_GONS(overrides?: CallOverrides): Promise<[BigNumber]>;

    LPRewards(overrides?: CallOverrides): Promise<[string]>;

    OHM(overrides?: CallOverrides): Promise<[string]>;

    contractBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    distributor(overrides?: CallOverrides): Promise<[string]>;

    epoch(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        length: BigNumber;
        number: BigNumber;
        endBlock: BigNumber;
        distribute: BigNumber;
      }
    >;

    giveBonusToLocker(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    index(overrides?: CallOverrides): Promise<[BigNumber]>;

    locker(overrides?: CallOverrides): Promise<[string]>;

    manager(overrides?: CallOverrides): Promise<[string]>;

    pullManagement(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    pushManagement(
      newOwner_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rebase(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    reclaimBonusFromLocker(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceManagement(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sOHM(overrides?: CallOverrides): Promise<[string]>;

    setContract(
      _contract: BigNumberish,
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stake(
      _amount: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalBonus(overrides?: CallOverrides): Promise<[BigNumber]>;

    unstake(
      _amount: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  INDEX_GONS(overrides?: CallOverrides): Promise<BigNumber>;

  LPRewards(overrides?: CallOverrides): Promise<string>;

  OHM(overrides?: CallOverrides): Promise<string>;

  contractBalance(overrides?: CallOverrides): Promise<BigNumber>;

  distributor(overrides?: CallOverrides): Promise<string>;

  epoch(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      length: BigNumber;
      number: BigNumber;
      endBlock: BigNumber;
      distribute: BigNumber;
    }
  >;

  giveBonusToLocker(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  index(overrides?: CallOverrides): Promise<BigNumber>;

  locker(overrides?: CallOverrides): Promise<string>;

  manager(overrides?: CallOverrides): Promise<string>;

  pullManagement(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  pushManagement(
    newOwner_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rebase(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  reclaimBonusFromLocker(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceManagement(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sOHM(overrides?: CallOverrides): Promise<string>;

  setContract(
    _contract: BigNumberish,
    _address: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stake(
    _amount: BigNumberish,
    _recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalBonus(overrides?: CallOverrides): Promise<BigNumber>;

  unstake(
    _amount: BigNumberish,
    _recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    INDEX_GONS(overrides?: CallOverrides): Promise<BigNumber>;

    LPRewards(overrides?: CallOverrides): Promise<string>;

    OHM(overrides?: CallOverrides): Promise<string>;

    contractBalance(overrides?: CallOverrides): Promise<BigNumber>;

    distributor(overrides?: CallOverrides): Promise<string>;

    epoch(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        length: BigNumber;
        number: BigNumber;
        endBlock: BigNumber;
        distribute: BigNumber;
      }
    >;

    giveBonusToLocker(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    index(overrides?: CallOverrides): Promise<BigNumber>;

    locker(overrides?: CallOverrides): Promise<string>;

    manager(overrides?: CallOverrides): Promise<string>;

    pullManagement(overrides?: CallOverrides): Promise<void>;

    pushManagement(newOwner_: string, overrides?: CallOverrides): Promise<void>;

    rebase(overrides?: CallOverrides): Promise<boolean>;

    reclaimBonusFromLocker(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    renounceManagement(overrides?: CallOverrides): Promise<void>;

    sOHM(overrides?: CallOverrides): Promise<string>;

    setContract(
      _contract: BigNumberish,
      _address: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    stake(
      _amount: BigNumberish,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    totalBonus(overrides?: CallOverrides): Promise<BigNumber>;

    unstake(
      _amount: BigNumberish,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    OwnershipPulled(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipPushed(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;
  };

  estimateGas: {
    INDEX_GONS(overrides?: CallOverrides): Promise<BigNumber>;

    LPRewards(overrides?: CallOverrides): Promise<BigNumber>;

    OHM(overrides?: CallOverrides): Promise<BigNumber>;

    contractBalance(overrides?: CallOverrides): Promise<BigNumber>;

    distributor(overrides?: CallOverrides): Promise<BigNumber>;

    epoch(overrides?: CallOverrides): Promise<BigNumber>;

    giveBonusToLocker(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    index(overrides?: CallOverrides): Promise<BigNumber>;

    locker(overrides?: CallOverrides): Promise<BigNumber>;

    manager(overrides?: CallOverrides): Promise<BigNumber>;

    pullManagement(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    pushManagement(
      newOwner_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rebase(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    reclaimBonusFromLocker(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceManagement(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sOHM(overrides?: CallOverrides): Promise<BigNumber>;

    setContract(
      _contract: BigNumberish,
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stake(
      _amount: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalBonus(overrides?: CallOverrides): Promise<BigNumber>;

    unstake(
      _amount: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    INDEX_GONS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    LPRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    OHM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    contractBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    distributor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    epoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    giveBonusToLocker(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    index(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    locker(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    manager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pullManagement(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    pushManagement(
      newOwner_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rebase(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    reclaimBonusFromLocker(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceManagement(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sOHM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setContract(
      _contract: BigNumberish,
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stake(
      _amount: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalBonus(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    unstake(
      _amount: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
