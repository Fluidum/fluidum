import { Component, OnInit } from '@angular/core';
import { OnChainService } from 'src/app/on-chain.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public onChainService:OnChainService) { }

  ngOnInit(): void {
  }

}
