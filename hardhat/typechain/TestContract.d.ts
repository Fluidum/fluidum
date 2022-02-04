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
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface TestContractInterface extends ethers.utils.Interface {
  functions: {
    "isCancelled(uint256)": FunctionFragment;
    "onboarding(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "isCancelled",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "onboarding",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "isCancelled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "onboarding", data: BytesLike): Result;

  events: {
    "DiceRolled(bytes32,address)": EventFragment;
    "ValueChangedEvent(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DiceRolled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ValueChangedEvent"): EventFragment;
}

export type DiceRolledEvent = TypedEvent<
  [string, string] & { requestId: string; roller: string }
>;

export type ValueChangedEventEvent = TypedEvent<
  [BigNumber] & { value: BigNumber }
>;

export class TestContract extends BaseContract {
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

  interface: TestContractInterface;

  functions: {
    isCancelled(
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    onboarding(
      phone: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  isCancelled(
    timestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  onboarding(
    phone: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    isCancelled(
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    onboarding(phone: BigNumberish, overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "DiceRolled(bytes32,address)"(
      requestId?: BytesLike | null,
      roller?: string | null
    ): TypedEventFilter<
      [string, string],
      { requestId: string; roller: string }
    >;

    DiceRolled(
      requestId?: BytesLike | null,
      roller?: string | null
    ): TypedEventFilter<
      [string, string],
      { requestId: string; roller: string }
    >;

    "ValueChangedEvent(uint256)"(
      value?: null
    ): TypedEventFilter<[BigNumber], { value: BigNumber }>;

    ValueChangedEvent(
      value?: null
    ): TypedEventFilter<[BigNumber], { value: BigNumber }>;
  };

  estimateGas: {
    isCancelled(
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    onboarding(
      phone: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isCancelled(
      timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    onboarding(
      phone: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}