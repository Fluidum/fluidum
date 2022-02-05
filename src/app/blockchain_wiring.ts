import { InjectionToken } from '@angular/core';
import FluidumContractMetadata from '../assets/contracts/Fluidum_metadata.json';
import {
  ContractShowModule,
  AddressShowModule,
  BlockchainModule,
  DialogModule,
  NotifierModule,
  HomeModule,
} from 'angular-web3';
import { ICONTRACT } from 'angular-web3';
import { DebugComponentModule } from './dapp-injector/components/debug-component';

export const fluidumContractMetadata = new InjectionToken<ICONTRACT>(
  'fluidumContractMetadata'
);

export const blockchain_providers = [
  { provide: 'fluidumContractMetadata', useValue: FluidumContractMetadata },
];

export const blockchain_imports = [
  HomeModule,
  ContractShowModule,
  AddressShowModule,
  DebugComponentModule,
  BlockchainModule,
  DialogModule,
  NotifierModule,
];
