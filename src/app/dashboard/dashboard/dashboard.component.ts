import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularContract, AngularWallet } from 'angular-web3';
import { Subject, takeUntil } from 'rxjs';
import { OnChainService } from 'src/app/on-chain.service';

@Component({
  selector: 'fluidum-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  connected: boolean;
  registered = false;
  wallet: AngularWallet;
  contract: AngularContract
  private ngUnsubscribe: Subject<void> = new Subject();
  constructor(private onChainService: OnChainService) {
    if (Math.random() > 0.5) this.connected = true;
    else this.connected = false;
  }

  async checkRegistered(){
   const address = await this.wallet.wallet.getAddress()
   this.registered = await (await this.contract.runFunction('checkRegistered',[address])).payload[0]
  }

  async register() {
    

  }

  ngOnInit(): void {
    this.onChainService.isChainReady
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((chain) => {
        this.connected = chain.active;
        this.contract = chain.contract
        this.wallet = chain.wallet;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }
}
