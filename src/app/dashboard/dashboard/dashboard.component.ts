import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularContract, AngularWallet, NotifierService } from 'angular-web3';
import { utils } from 'ethers';
import { Subject, takeUntil } from 'rxjs';
import { OnChainService } from '../../on-chain.service';

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
   
      console.log(result)

    console.log(this.registered);
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
