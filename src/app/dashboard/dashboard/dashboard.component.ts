import { environment } from 'src/environments/environment';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  AngularContract,
  AngularNetworkProvider,
  AngularWallet,
  NotifierService,
} from 'angular-web3';
import { utils } from 'ethers';
import { interval, Observable, Subject, takeUntil } from 'rxjs';
import { OnChainService } from '../../on-chain.service';
import { Framework } from '@superfluid-finance/sdk-core';
import { providers } from 'ethers';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Console, timeStamp } from 'console';

@Component({
  selector: 'fluidum-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  connected: boolean;
  flows: Array<any>;
  registered;
  wallet: AngularWallet;
  contract: AngularContract;
  phoneNumberCtrl: FormControl = new FormControl('', [
    Validators.required,
    Validators.min(100000),
  ]);
  codeCtrl: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(6),
    Validators.minLength(6),
  ]);
  address: string;
  private ngUnsubscribe: Subject<void> = new Subject();
  showInputCode: boolean;
  phoneNumber: any;

  constructor(
    private notifierService: NotifierService,

    public onChainService: OnChainService,
    private http: HttpClient
  ) {
    // this.phoneNumberCtrl.valueChanges.subscribe(value=> {
    //   console.log(value);
    //   console.log (this.phoneNumberCtrl.invalid)
    // })
  }

  async getFlows() {
    this.onChainService.isbusySubject.next(true);
    this.address = await this.wallet.getAddress();
    // const result = await this.contract.runFunction('checkRegistered', [
    //   this.address,
    // ]);
    const result = await await this.contract.runFunction('getUserFlows', [
      this.address,
    ]);
    this.flows = [];

    console.log();
    for (const ele of result.payload[0]) {
    
  
      this.flows.push({ sender: ele[0], receiver: ele[1], message: ele[2] });
    }
    console.log(this.flows);
    console.log(
      `Address ${this.address} registration status: ${this.registered}`
    );

    // ]);
    let isSender = false;
    console.log(result.payload[0][0][0])
    if(result.payload[0][0][0]== this.address) {
      isSender = true;
    }

    let adressCheck = result.payload[0][0][0]; //< isSender = true ? this.address :result.payload[0][0][1]

    const result2 = await await this.contract.runFunction('getFlowDetails', [
      adressCheck,
    ]);
    console.log(result2);
    this.flows = [];

   // for (const ele of result2.payload[0]) {
      this.flows.push({
        timeStamp: +result2.payload[0].toString(),
        inflowRate: +result2.payload[1].toString(),
        deposit: +result2.payload[2].toString(),
        value:0,
        isSender,
        sender:result.payload[0][0][0],
        receiver:result.payload[0][0][1],
        message:result.payload[0][0][2]
  
    })
    console.log(result.payload[0][1])
    console.log(this.address)
    console.log(isSender)
//emit value in sequence every 1 second
      const source = interval(500);
      //output: 0,1,2,3,4,5....
      const subscribe = source.pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
        console.log(Date.now())
        if (this.flows[0].isSender == true){
          this.flows[0].value = this.flows[0].deposit - (Math.floor((Date.now()/1000))-this.flows[0].timeStamp)*this.flows[0].timeStamp;
        } else {
          this.flows[0].value = this.flows[0].deposit + (Math.floor((Date.now()/1000))-this.flows[0].timeStamp)*this.flows[0].timeStamp;
        }
     
        console.log(val);
        console.log(this.flows[0])
      })

    console.log(this.flows);
    console.log(
      `Address ${this.address} registration status: ${this.registered}`
    );

    this.onChainService.isbusySubject.next(false);
  }

  async checkRegistered() {
    this.onChainService.isbusySubject.next(true);
    this.address = await this.wallet.getAddress();
    // const result = await this.contract.runFunction('checkRegistered', [
    //   this.address,
    // ]);

    const result =  await this.contract.runFunction('checkRegistered', [this.address])
      console.log(this.contract.Contract.address)
    console.log(result)

    this.registered = await result.payload[0];
    console.log(
      `Address ${this.address} registration status: ${this.registered}`
    );
    this.onChainService.isbusySubject.next(false);
  }

  async startFlow() {
    this.onChainService.isbusySubject.next(true);
    const provider = this.onChainService.myProvider.Provider;

    const sf = await Framework.create({
      networkName: 'mumbai',
      provider: provider,
    });

    const signer = sf.createSigner({
      privateKey: environment.privKey,
      provider: provider,
    });

    try {
      const recipient = this.contract.Contract.address;
      const flowRate = '3225232222200000';

      console.log(
        `Hashed phone is ${utils.keccak256(utils.toUtf8Bytes('886999888777'))}`
      );
      const userAddress = await this.wallet.getAddress();
      const hash = utils.defaultAbiCoder.encode(
        ['bytes32', 'string', 'address'],
        [
          utils.keccak256(utils.toUtf8Bytes('886999888777')),
          'hello!',
          userAddress,
        ]
      );

      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: flowRate,
        receiver: recipient,
        superToken: environment.mumbaiDAIx,
        userData: hash,
      });

      console.log('Creating your stream...');

      const result = await createFlowOperation.exec(signer);
      console.log(result);

      console.log(
        `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
  
    Sender: ${userAddress}
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
    this.onChainService.isbusySubject.next(false);
  }

  async startVerification() {
    this.onChainService.isbusySubject.next(true);
    console.log(this.phoneNumberCtrl.value);

    this.phoneNumber = this.phoneNumberCtrl.value;

    this.address = await this.wallet.getAddress();

    const myResult = await this.startVerificationCloud({
      phoneNumber: this.phoneNumberCtrl.value,

      control: '20220204',
      address: this.address,
    }).toPromise();
    console.log(myResult);
    if (myResult.success == true) {
      this.onChainService.isbusySubject.next(false);
      this.showInputCode = true;
    } else {
      await this.notifierService.showNotificationTransaction({
        success: false,
        error_message: 'Oops error connecting the cloud',
      });
      this.onChainService.isbusySubject.next(false);
    }

    // if (myResult.msg.success == false) {
    //   await this.notifierService.showNotificationTransaction(myResult.msg);
    // }

    // if (myResult.msg.success_result !== undefined) {
    //   await this.notifierService.showNotificationTransaction(myResult.msg);
    // }
  }

  async createStream() {}

  async register() {}

  async disconnectModal() {}

  async finishVerification() {
    this.showInputCode = false;
    this.onChainService.isbusySubject.next(true);

    this.address = await this.wallet.getAddress();

    console.log(this.phoneNumberCtrl.value);
    console.log(this.phoneNumber);
    console.log(this.codeCtrl.value);
    const phoneNumberHash = utils.keccak256(
      utils.toUtf8Bytes(this.phoneNumber)
    );
    const myResult = await this.contract.runFunction('finishVerification', [
      this.codeCtrl.value,
      phoneNumberHash,
      { gasLimit: 10000000 },
    ]);

    // if (myResult.msg.success == false) {
    //   await this.notifierService.showNotificationTransaction(myResult.msg);
    // }

    // if (myResult.msg.success_result !== undefined) {
    //   await this.notifierService.showNotificationTransaction(myResult.msg);
    // }
  }
  startVerificationCloud(verificationObject: {
    phoneNumber: string;

    address: string;
    control: string;
  }): Observable<any> {
    // let booking = {uid: queryUid }

    const url =
      'https://us-central1-fluidum-eth.cloudfunctions.net/fluidumVerify';
    const body = JSON.parse(JSON.stringify(verificationObject));
    // url changed from this.introUrl
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, body, httpOptions);
  }

  ngOnInit(): void {
    this.onChainService.isChainReady
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (chain) => {
        this.connected = chain.active;
        this.contract = chain.contract;
        this.contract.Contract.on('RegistrationSuccessEvent', (args) => {
          console.log('success');
          this.notifierService.showNotificationTransaction({
            success: true,
            success_message: 'Great you are already On board',
          });
          this.registered = true;
          this.onChainService.isbusySubject.next(false);
        });

        this.contract.Contract.on('RegistrationTimedOutEvent', (args) => {
          this.notifierService.showNotificationTransaction({
            success: false,
            error_message: 'Sorry timeout, start onboarding process again',
          });
          this.onChainService.isbusySubject.next(false);
        });
        this.wallet = chain.wallet;
        this.getFlows();
        await this.checkRegistered();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }
}
