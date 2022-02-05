import { Component, OnInit } from '@angular/core';
import { OnChainService } from 'src/app/on-chain.service';

@Component({
  selector: 'fluidum-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
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
  connected: boolean;
  //wallet: import("c:/Users/javie/Documents/WEB/BLOCKCHAIN/fluidum/src/app/dapp-injector/index").AngularWallet;
  constructor(private onChainService: OnChainService) {}

  ngOnInit(): void {
    this.onChainService.isChainReady.subscribe((chain) => {
      this.connected = chain.active;
      //this.wallet = chain.wallet;
    });
  }
}
