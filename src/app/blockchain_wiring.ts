
import { InjectionToken } from '@angular/core';
import TestContractMetadata from '../assets/contracts/test_contract_metadata.json';
import { ContractShowModule, AddressShowModule, BlockchainModule, DialogModule, NotifierModule, HomeModule } from 'angular-web3';
import {ICONTRACT } from 'angular-web3';
import { DebugComponentModule } from './dapp-injector/components/debug-component';


export const testContractMetadata = new InjectionToken<ICONTRACT>('testContractMetadata')

export const blockchain_providers = [ {provide:'testContractMetadata', useValue:TestContractMetadata}]


export const blockchain_imports = [HomeModule,ContractShowModule,AddressShowModule,DebugComponentModule,BlockchainModule,DialogModule,NotifierModule]
