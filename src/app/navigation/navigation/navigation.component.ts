import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularWallet } from 'angular-web3';
import { Subject, takeUntil } from 'rxjs';
import { OnChainService } from 'src/app/on-chain.service';

@Component({
  selector: 'fluidum-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  navLinks: any[] = [
    {
      label: 'Landing',
      link: './home',
      index: 0,
    },
    {
      label: 'Dashboard',
      link: './dashboard',

      index: 1,
    },
    {
      label: 'Debug Contract',
      link: './debug',
      index: 5,
    },
  ];
  private ngUnsubscribe: Subject<void> = new Subject();
  connected: boolean;
  wallet: AngularWallet;
  constructor(private onChainService: OnChainService) {}

  ngOnInit(): void {
    this.onChainService.isChainReady.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((chain) => {
      this.connected = chain.active;
      this.wallet = chain.wallet;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
}
}
