import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fluidum-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  connected: boolean;

  constructor() {
    if (Math.random() > 0.5) this.connected = true;
    else this.connected = false;
  }

  ngOnInit(): void {}
}
