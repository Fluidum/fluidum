import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularContract, AngularNetworkProvider, AngularWallet, NotifierService } from 'angular-web3';
import { utils } from 'ethers';
import { Observable, Subject, takeUntil } from 'rxjs';
import { OnChainService } from '../../on-chain.service';
 import { Framework } from '@superfluid-finance/sdk-core';
import { providers } from 'ethers';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    private onChainService: OnChainService,
    private http:HttpClient
  ) {
    // this.phoneNumberCtrl.valueChanges.subscribe(value=> {
    //   console.log(value);
    //   console.log (this.phoneNumberCtrl.invalid)
    // })
  }

  async checkRegistered() {
    this.onChainService.isbusySubject.next(true);
    this.address = await this.wallet.getAddress();
    const result = await this.contract.runFunction('checkRegistered', [
      this.address,
    ]);
    this.registered = await (
      await this.contract.runFunction('checkRegistered', [this.address])
    ).payload[0];
    console.log(this.registered)
    this.onChainService.isbusySubject.next(false);
  
  }

  async startFlow() {
    this.onChainService.isbusySubject.next(true);
    const provider = this.onChainService.myProvider.Provider;

   const  url =`https://kovan.infura.io/v3/212d29e8e6d145d78a350b2971f326be`;
   const kovanProvider = new AngularNetworkProvider([url])
   await kovanProvider.init();
  const checkProvider =  kovanProvider.Provider
    const sf = await Framework.create({
      networkName: 'kovan',
     provider:checkProvider
    });

    try {

      ////// I've tried mumbai what ddint' work copy the sandox from tutorialinlcusive private key and works
      ///// cahnge the recivpient to yours and will wotk

      const customHttpProvider = new providers.JsonRpcProvider(url);
      const recipient = '0x643F42a5283C937Ec051390f9b229F7546916bB4';
      const flowRate = '3225232222200000';
      const DAIx = "0xe3cb950cb164a31c66e32c320a800d477019dcff";
      const sf = await Framework.create({
        networkName: "kovan",
        provider: customHttpProvider
      });
      const signer = sf.createSigner({
        privateKey:
          "0xd2ebfb1517ee73c4bd3d209530a7e1c25352542843077109ae77a2c0213375f1",
        provider: customHttpProvider
      });
    
      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: flowRate,
        receiver: recipient,
        superToken: DAIx, //'0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
        overrides: { gasLimit: 10000000 },
        // userData?: string {}
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
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(JSON.stringify(error));
    }
    this.onChainService.isbusySubject.next(false);
  }

  async startVerification() {
    this.onChainService.isbusySubject.next(true);
    console.log(this.phoneNumberCtrl.value);
    this.address = await this.wallet.getAddress();
    const kekash = utils.keccak256(this.phoneNumberCtrl.value);
    console.log(kekash)
    const myResult = await this.startVerificationCloud({phoneNumberHash:kekash, control: "20220204",address:this.address}).toPromise()


   
    if (myResult.msg.success == false) {
      await this.notifierService.showNotificationTransaction(myResult.msg);
    }

    if (myResult.msg.success_result !== undefined) {
      await this.notifierService.showNotificationTransaction(myResult.msg);
    }
    this.onChainService.isbusySubject.next(false);
  }

  async createStream() {}

  async register() {}


  async finishVerification() {
    this.onChainService.isbusySubject.next(true);
    console.log(this.phoneNumberCtrl.value);
    this.address = await this.wallet.getAddress();
    const kekash = utils.keccak256(this.phoneNumberCtrl.value);
    const myResult = await this.contract.runFunction('mockRegistration', [
      this.address,
      kekash
    ]);

   
    if (myResult.msg.success == false) {
      await this.notifierService.showNotificationTransaction(myResult.msg);
    }

    if (myResult.msg.success_result !== undefined) {
      await this.notifierService.showNotificationTransaction(myResult.msg);
    }
    this.onChainService.isbusySubject.next(false);
  }
  startVerificationCloud(verificationObject: {phoneNumberHash:string,address:string, control:string }): Observable<any> {

    // let booking = {uid: queryUid }

    const url =
    'https://us-central1-fluidum-eth.cloudfunctions.net/fluidumVerify';
    const body = JSON.parse(JSON.stringify(verificationObject));
    // url changed from this.introUrl
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, body, httpOptions);
  
  }


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
