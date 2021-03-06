import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ContractInputComponent } from '../contract-input/contract-input.component';

import { ethers } from 'ethers';
import {
  BlockWithTransactions,
  convertEtherToWei,
  convertUSDtoEther,
  convertWeiToEther,
  DialogService,
  displayEther,
  displayUsd,
  IABI_OBJECT,
  IBALANCE,
  ICONTRACT,
  IINPUT_EVENT,
  NotifierService,
} from 'angular-web3';
import { OnChainService } from 'src/app/on-chain.service';

@Component({
  selector: 'debug-contract',
  templateUrl: './debug-contract.component.html',
  styleUrls: ['./debug-contract.component.css'],
})
export class DebugContractComponent implements AfterViewInit {
  blocks: Array<BlockWithTransactions> = [];
  contract_abi: Array<IABI_OBJECT>;
  walletBalance!: IBALANCE;
  contractBalance!: IBALANCE;
  contractHeader!: ICONTRACT;
  deployer_address!: string;
  myContract!: ethers.Contract;
  greeting!: string;
  greeting_input!: string;
  provider!: ethers.providers.JsonRpcProvider;
  signer: any;
  deployer_balance: any;
  loading_contract: 'loading' | 'found' | 'error' = 'loading';
  componentInstances: Array<ContractInputComponent> = [];
  stateInstances: Array<ContractInputComponent> = [];
  events: Array<any> = [];
  eventsAbiArray: Array<any> = [];
  isChainReady = false;

  newWallet!: ethers.Wallet;

  dollarExchange!: number;
  balanceDollar!: number;
  constructor(
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private notifierService: NotifierService,
    private onChainService: OnChainService,

    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @ViewChild('inputContainer', { read: ViewContainerRef })
  inputContainer!: ViewContainerRef;

  @ViewChild('stateContainer', { read: ViewContainerRef })
  stateContainer!: ViewContainerRef;

  @ViewChild('payableContainer', { read: ViewContainerRef })
  payableContainer!: ViewContainerRef;

  add(abi: IABI_OBJECT): void {
    this.cd.detectChanges();
    // create the compoxnent factory
    const dynamicComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        ContractInputComponent
      );

    let componentRef: any;
    // add the component to the view

    if (
      abi.stateMutability == 'view' &&
      abi.inputs.length == 0 &&
      abi.outputs.length == 1
    ) {
      componentRef = this.stateContainer.createComponent(
        dynamicComponentFactory
      );
      this.stateInstances.push(componentRef.instance);
    } else if (abi.stateMutability == 'payable') {
      componentRef = this.payableContainer.createComponent(
        dynamicComponentFactory
      );
    } else {
      componentRef = this.inputContainer.createComponent(
        dynamicComponentFactory
      );
    }
    componentRef.instance.initUi(abi);
    this.componentInstances.push(componentRef.instance);

    componentRef.instance.newEventFunction.subscribe(
      async (value: IINPUT_EVENT) => {
        console.log(value);

        const myResult = await this.onChainService.fluidumContract.runFunction(
          value.function,
          value.args,
          value.state
        );

        if (myResult.msg.success == false) {
          await this.notifierService.showNotificationTransaction(myResult.msg);
        }

        if (myResult.msg.success_result !== undefined) {
          await this.notifierService.showNotificationTransaction(myResult.msg);
        }

        if (value.function !== 'pure' && value.function !== 'view') {
          this.updateState();
        }

        if (value.outputs.length > 0) {
          if (myResult.msg.success == true) {
            componentRef.instance.refreshUi(myResult.payload);
          } else {
            await this.notifierService.showNotificationTransaction(
              myResult.msg
            );
          }
        }
      }
    );
  }

  async updateState() {
    for (const stateCompo of this.stateInstances) {
      const result =
        await this.onChainService.fluidumContract.runContractFunction(
          stateCompo.abi_input.name as string,
          {}
        );

      if (result.msg.success == true) {
        stateCompo.refreshUi(result.payload);
      } else {
        this.notifierService.showNotificationTransaction(result.msg);
      }
    }
  }

  async onChainStuff() {
    try {
      this.deployer_address = 'deployer address';

      // await this.onChainService.myProvider.Signer.getAddress();

      this.onChainService.myProvider.blockEventSubscription.subscribe(
        async (blockNr) => {
          this.onChainService.fluidumContract.refreshBalance();
          this.onChainService.newWallet.refreshWalletBalance();
          this.onChainService.isbusySubject.next(false);
          const block =
            await this.onChainService.myProvider.Provider.getBlockWithTransactions(
              blockNr
            );
          this.blocks = [block].concat(this.blocks);
        }
      );

      this.newWallet = await this.onChainService.newWallet.wallet;
      this.myContract = this.onChainService.fluidumContract.Contract;

      this.onChainService.fluidumContract.contractBalanceSubscription.subscribe(
        async (balance) => {
          const ehterbalance = convertWeiToEther(balance);
          const dollar =
            ehterbalance * (await this.onChainService.getDollarEther());
          this.contractBalance = {
            ether: displayEther(ehterbalance),
            usd: displayUsd(dollar),
          };
        }
      );

      this.onChainService.newWallet.walletBalanceSubscription.subscribe(
        async (balance) => {
          const ehterbalance = convertWeiToEther(balance);
          const dollar =
            ehterbalance * (await this.onChainService.getDollarEther());
          this.walletBalance = {
            ether: displayEther(ehterbalance),
            usd: displayUsd(dollar),
          };
        }
      );

      this.contractHeader = {
        name: this.onChainService.fluidumContract.metadata.name,
        address: this.onChainService.fluidumContract.metadata.address,
      };

      this.eventsAbiArray = this.contract_abi.filter(
        (fil) => fil.type == 'event'
      );

      this.eventsAbiArray.forEach((val) => {
        this.myContract.on(val.name, (args) => {
          let payload;
          if (typeof args == 'object') {
            payload = JSON.stringify(args);
          } else {
            payload = args.toString();
          }

          this.events.unshift({
            name: val.name,
            payload,
            timeStamp: new Date().toLocaleTimeString(),
          });
        });
      });

      this.contract_abi
        .filter((fil) => fil.type !== 'constructor')
        .filter((fil) => fil.type !== 'event')
        .filter((fil) => fil.type !== 'receive')
        .forEach((abi) => {
          this.add(abi);
        });

      this.updateState();
      this.cd.detectChanges();
    } catch (error) {
      console.log(error);
      this.loading_contract = 'error';
    }
  }

  async addBlock(blockNr: number) {
    const block =
      await this.onChainService.myProvider.Provider.getBlockWithTransactions(
        blockNr
      );
    this.blocks = this.blocks.concat(block);
  }

  async doFaucet() {
    this.onChainService.isbusySubject.next(true);
    let amountInEther = '0.01';
    // Create a transaction object
    let tx = {
      to: this.newWallet.address,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther(amountInEther),
    };
    // Send a transaction
    const transaction_result =
      await this.onChainService.myProvider.doTransaction(tx);
    this.onChainService.isbusySubject.next(false);
    await this.notifierService.showNotificationTransaction(transaction_result);
  }

  async openTransaction() {
    const res = await this.dialogService.openDialog();

    if (res && res.type == 'transaction') {
      this.onChainService.isbusySubject.next(true);
      const usd = res.amount;
      const amountInEther = convertUSDtoEther(
        res.amount,
        await this.onChainService.getDollarEther()
      );
      const amountinWei = convertEtherToWei(amountInEther);

      let tx = {
        to: res.to,
        // Convert currency unit from ether to wei
        value: amountinWei,
      };

      const transaction_result =
        await this.onChainService.newWallet.doTransaction(tx);
      this.onChainService.isbusySubject.next(false);
      await this.notifierService.showNotificationTransaction(
        transaction_result
      );
    } else {
    }
  }

  ngAfterViewInit(): void {
    this.onChainService.isChainReady.subscribe(async (isReady) => {
      console.log(isReady);
      if (!!isReady) {
        this.isChainReady = isReady.active;
        if (this.isChainReady == true) {
          this.contract_abi = this.onChainService.fluidumContract.metadata.abi;
          console.log(this.contract_abi);
          await this.onChainStuff();
          this.cd.detectChanges();
        }
      }
    });
  }
}
