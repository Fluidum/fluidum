import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { convertEtherToWei, convertUSDtoEther, NotifierService } from 'angular-web3';
import { utils } from 'ethers';
import { Subject } from 'rxjs';


import { Framework } from '@superfluid-finance/sdk-core';
import { OnChainService } from '../../on-chain.service';
import { Router } from '@angular/router';

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
    private onChainService: OnChainService,
    private router:Router
  ) {
    
  }

  async checkRegistered() {
    if (this.phoneNumberCtrl.invalid){
      return
    }
    this.onChainService.isbusySubject.next(true);
    this.address = await this.wallet.getAddress();
    const phoneHash = utils.keccak256(utils.toUtf8Bytes(this.phoneNumberCtrl.value))
 
    this.registered = await (
      await this.contract.runFunction('checkRegisteredByPhone', [ phoneHash])
    ).payload[0];
    console.log(
      `phoneNumber ${phoneHash} registration status: ${this.registered}`
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
      const flowRate = Math.floor(+amountinWei/this.flowRateCtrl.value).toString()

        console.log(flowRate)
        this.registered = false;

 
     // console.log(Math.floor(+amountinWei/this.flowRateCtrl.value) )
     this.onChainService.isbusySubject.next(true);
     const provider = this.onChainService.myProvider.Provider;
 
     const sf = await Framework.create({
       networkName: 'mumbai',
       provider: provider,
     });
 
     const signer = sf.createSigner({
       web3Provider: this.onChainService.injectionProvider.provider
     });
 
     try {
       const recipient = this.contract.Contract.address
       ;
 
       console.log(
         `Hashed phone is ${utils.keccak256(utils.toUtf8Bytes(this.phoneNumberCtrl.value))}`
       );
       const hash = utils.defaultAbiCoder.encode(
         ['bytes32', 'string'],
         [utils.keccak256(utils.toUtf8Bytes(this.phoneNumberCtrl.value)), 'hello!']
       );
 
       const createFlowOperation = sf.cfaV1.createFlow({
         flowRate: flowRate,
         receiver: recipient,
         superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f' ,//environment.mumbaiDAIx,
         userData: hash,
       });
 
       console.log('Creating your stream...');
 
       const result = await createFlowOperation.exec(signer);
       console.log(result);
 
       console.log(
         `Congrats - you've just created a money stream!
     View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
   
     Sender: ${await this.wallet.getAddress()}
     Receiver: ${recipient},
     FlowRate: ${flowRate}
     `
       );
        this.notifierService.showNotificationTransaction({success:true,success_message:"BRAVO!! Stream Created"})
        this.router.navigate(['/dashboard'])

     } catch (error) {
       console.log(
         "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
       );
       console.error(error);
     }
     this.onChainService.isbusySubject.next(false);


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

