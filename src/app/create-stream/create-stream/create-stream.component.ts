import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { convertEtherToWei, convertUSDtoEther, NotifierService } from 'angular-web3';
import { Subject } from 'rxjs';


import { OnChainService } from '../../on-chain.service';

@Component({
  selector: 'create-stream',
  templateUrl: './create-stream.component.html',
  styleUrls: ['./create-stream.component.scss'],
})
export class CreateStreamComponent implements OnInit {
  time = {
    week: 7,
    month:30,
    day:24,
    hour:60
  }
 
  friendRegistered= false
  isFriendConnected:false;
  phoneNumberCtrl: FormControl = new FormControl('', [
    Validators.required,
    Validators.min(100000),
  ]); 
  flowRateCtrl:FormControl = new FormControl(0, [Validators.required,Validators.min(1)]);
  amountCtrl:FormControl = new FormControl(0, [Validators.required,Validators.min(1)]);
  private ngUnsubscribe: Subject<void> = new Subject();
  contract: any;
  wallet: any;
  flowFormGroup: FormGroup;
  period: string;
  address: any;
  registered: any;
  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private onChainService: OnChainService
  ) {
    
  }

  async checkRegistered() {
    this.registered = true;
    return 
    this.onChainService.isbusySubject.next(true);
    this.address = await this.wallet.getAddress();
    const result = await this.contract.runFunction('checkRegistered', [
      this.address,
    ]);
    this.registered = await (
      await this.contract.runFunction('checkRegistered', [this.address])
    ).payload[0];
    console.log(
      `Address ${this.address} registration status: ${this.registered}`
    );
    this.onChainService.isbusySubject.next(false);
  }

  changeTime(value:string){
    this.period = value
    if (value == 'month') {
      this.flowRateCtrl.setValue(3600 * 24 * 30)
    } else if (value == 'week') {
      this.flowRateCtrl.setValue(3600 * 24 * 7)
    } else if (value == 'day') {
      this.flowRateCtrl.setValue(3600 * 24 )
    }else if (value == 'hour') {
      this.flowRateCtrl.setValue(3600)
    }
    

  }

 async  startStream() {
    if (this.flowRateCtrl.valid && this.amountCtrl.valid) {
      const amountInEther = convertUSDtoEther(
        this.amountCtrl.value,
        await this.onChainService.getDollarEther()
      );
      const amountinWei = convertEtherToWei(amountInEther);
      const flowRate = +amountinWei/this.flowRateCtrl.value;


     // console.log(Math.floor(+amountinWei/this.flowRateCtrl.value) )
    }

  }

  ngOnInit(): void {
    this.onChainService.isChainReady
      .subscribe(async (chain:any) => {
        
        this.contract = chain.contract;
        this.wallet = chain.wallet;
    
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }
}
function takeUntil(ngUnsubscribe: any): import("rxjs").OperatorFunction<{ active: boolean; wallet?: import("angular-web3").AngularWallet; provider?: import("angular-web3").AngularNetworkProvider; contract?: import("angular-web3").AngularContract; }, unknown> {
  throw new Error('Function not implemented.');
}

