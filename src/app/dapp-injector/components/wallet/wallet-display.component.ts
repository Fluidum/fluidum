import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { createIcon } from '@download/blockies';
import { AngularWallet, convertWeiToEther ,  displayEther,
  displayUsd} from 'angular-web3';
import { OnChainService } from 'src/app/on-chain.service';



@Component({
  selector: 'wallet-display',
  templateUrl: './wallet-display.component.html',
  styleUrls: ['./wallet-display.component.css']
})
export class WalletDisplayComponent implements OnInit,AfterViewInit, OnChanges {
  blockiesOptions:any;
  address_to_show!:string;
  balance: { ether: any; usd: any; };

  constructor(private renderer:Renderer2, private onChainService:OnChainService) {
    this.onChainService.newWallet.walletBalanceSubscription.subscribe(
      async (balance) => {
        const ehterbalance = convertWeiToEther(balance);
        const dollar =
          ehterbalance * (await this.onChainService.getDollarEther());
        this.balance = {
          ether: displayEther(ehterbalance),
          usd: displayUsd(dollar),
        };
      }
    );
   }

  ngOnChanges(changes: SimpleChanges): void {

  }

  @ViewChild("wallet", {read: ElementRef}) private walletDiv!: ElementRef;
  ngAfterViewInit(): void {
  const icon = createIcon(this.blockiesOptions);
  
  this.renderer.appendChild(this.walletDiv.nativeElement,icon);
  }

  @Input() myWallet:AngularWallet

 async onChainStuff(){
   this.address_to_show =  await this.myWallet._myWallet.getAddress()
  this.blockiesOptions = { // All options are optional
    seed: this.address_to_show, // seed used to generate icon data, default: random
    color: '#dfe', // to manually specify the icon color, default: random
    bgcolor: '#aaa', // choose a different background color, default: random
    size: 8, // width/height of the icon in blocks, default: 8
    scale: 3, // width/height of each block in pixels, default: 4
    spotcolor: '#000' // each pixel has a 13% chance of being of a third color,
    // default: random. Set to -1 to disable it. These "spots" create structures
    // that look like eyes, mouths and noses.
  }
  await this.myWallet.refreshWalletBalance()
  }
  


  ngOnInit(): void {
      this.onChainStuff()
  }




}
