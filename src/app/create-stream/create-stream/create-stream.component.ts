import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-web3';
import { Subject } from 'rxjs';


import { OnChainService } from '../../on-chain.service';

@Component({
  selector: 'create-stream',
  templateUrl: './create-stream.component.html',
  styleUrls: ['./create-stream.component.scss'],
})
export class CreateStreamComponent implements OnInit {
  phoneNumberCtrl: FormControl = new FormControl('', [
    Validators.required,
    Validators.min(100000),
  ]);
  private ngUnsubscribe: Subject<void> = new Subject();
  contract: any;
  wallet: any;
  constructor(
    private notifierService: NotifierService,
    private onChainService: OnChainService
  ) {}

  startStream() {}

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

