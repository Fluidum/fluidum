import { Component, OnInit } from '@angular/core';
import { OnChainService } from './on-chain.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'fluidum';

  isBusy: boolean = true;

  constructor(public onChainService: OnChainService) {}

  ngOnInit(): void {
    this.onChainStuff();
  }
  async onChainStuff() {
    await this.onChainService.init();
    this.onChainService.isbusySubject.subscribe(isBusy=> {
      this.isBusy = isBusy
    })
  }
}
