import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularContract, AngularWallet, NotifierService } from 'angular-web3';
import { utils } from 'ethers';
import { Subject, takeUntil } from 'rxjs';
import { OnChainService } from '../../on-chain.service';
import { Framework } from "@superfluid-finance/sdk-core";

@Component({
  selector: 'fluidum-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  connected: boolean;
  registered;
  wallet: AngularWallet;
  contract: AngularContract;
  phoneNumberCtrl: FormControl = new FormControl('', [
    Validators.required,
    Validators.min(100000),
  ]);
  address: string;
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    private notifierService: NotifierService,
    private onChainService: OnChainService
  ) {
    // this.phoneNumberCtrl.valueChanges.subscribe(value=> {
    //   console.log(value);
    //   console.log (this.phoneNumberCtrl.invalid)
    // })
  }

  async checkRegistered() {
    this.address = await this.wallet.getAddress();
    const result=
      await this.contract.runFunction('checkRegistered', [this.address])
   this.registered = await( await this.contract.runFunction('checkRegistered', [this.address])).payload[0]
      console.log(result)

    console.log(this.registered);
  }

  async startFlow(){
    const provider = this.onChainService.myProvider.Provider
    const sf = await Framework.create({
      networkName: "mumbai",
      provider
    });
    
  try {
    const recipient = "0x643F42a5283C937Ec051390f9b229F7546916bB4";
    const flowRate = "38580246910"
    const createFlowOperation = sf.cfaV1.createFlow({
      flowRate: flowRate,
      receiver: recipient,
      superToken: "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f",
      overrides: {gasLimit:50000}
      // userData?: string {}
    });

    console.log("Creating your stream...");
    const mywallet = this.wallet._myWallet;
    const result = await createFlowOperation.exec(mywallet);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
  
    Sender: ${this.wallet.getAddress()}
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(JSON.stringify(error));
  }
  }

  async startVerification() {
    console.log(this.phoneNumberCtrl.value);
    this.address = await this.wallet.getAddress();
    const kekash = utils.keccak256(this.phoneNumberCtrl.value);
    const myResult = await this.contract.runFunction('mockRegistration', [
      this.address,
      kekash,
    ]);
    if (myResult.msg.success == false) {
      await this.notifierService.showNotificationTransaction(myResult.msg);
    }

    if (myResult.msg.success_result !== undefined) {
      await this.notifierService.showNotificationTransaction(myResult.msg);
    }
  }

  async createStream() {}

  async register() {}

  ngOnInit(): void {
    this.onChainService.isChainReady
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (chain) => {
        this.connected = chain.active;
        this.contract = chain.contract;
        this.wallet = chain.wallet;
        await this.checkRegistered();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }
}
