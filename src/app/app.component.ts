import { Component, OnInit } from '@angular/core';
import { OnChainService } from './on-chain.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'fluidum';
  navLinks: any[] = [
    {
      label: 'Landing',
      link: './home',
      index: 0,
    },
    {
      label: 'Debug Contract',
      link: './debug',  
      index: 1,
    },
    // {
    //   label: 'Hello Contract',
    //   link: './hello-world',
    //   index:2,
    // },
  ];

  constructor(public onChainService: OnChainService) {}

  ngOnInit(): void {
    this.onChainStuff();
  }
  async onChainStuff() {
    await this.onChainService.init();
  }
}
