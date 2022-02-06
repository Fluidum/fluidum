import { environment } from './../environments/environment';
import { Inject, Injectable } from '@angular/core';
import {
  AngularContract,
  AngularNetworkProvider,
  AngularWallet,
  ICONTRACT,
} from 'angular-web3';
import { Contract, providers } from 'ethers';
import { ReplaySubject } from 'rxjs';
import { uniswap_abi } from './uniswap_abi';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OnChainService {
  private _dollarExchange!: number;
  myProvider!: AngularNetworkProvider;
  newWallet!: AngularWallet;
  fluidumContract!: AngularContract;
  public allowedChain: boolean;
  public isChainReady: ReplaySubject<{
    active: boolean;
    wallet?: AngularWallet;
    provider?: AngularNetworkProvider;
    contract?: AngularContract;
  }> = new ReplaySubject(1);
  public isbusySubject: ReplaySubject<boolean> = new ReplaySubject(1);
  injectionProvider: { provider: providers.Web3Provider; signer: providers.JsonRpcSigner; providerNetwork: providers.Network; found:boolean };
  constructor(
    private router:Router,
    @Inject('fluidumContractMetadata') public fluidumContractMetadata: ICONTRACT
  ) {}

  async getDollarEther() {
    if (this._dollarExchange == undefined) {
      const uniswapUsdcAddress = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';
      const uniswapAbi = uniswap_abi;

      const uniswapService = new AngularNetworkProvider([
        'https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406',
        `https://eth-mainnet.alchemyapi.io/v2/oKxs-03sij-U_N0iOlrSsZFr29-IqbuF`,
        'https://rpc.scaffoldeth.io:48544',
      ]);

      await uniswapService.init();

      const getUniswapContract = async (address: string) =>
        await new Contract(address, uniswapAbi, uniswapService.Provider);
      const contract = await getUniswapContract(uniswapUsdcAddress);
      const reserves = await contract['getReserves']();

      this._dollarExchange =
        (Number(reserves._reserve0) / Number(reserves._reserve1)) * 1e12;
    }
    return this._dollarExchange;
  }

  async init() {
    let metamaskDeployment = true;
    let localhost = false;

    if (environment.production) {
      metamaskDeployment = true;
      localhost = false;
    }

    if (localhost == false) {
      this.myProvider = new AngularNetworkProvider([
        `https://speedy-nodes-nyc.moralis.io/${environment.moralisId}/polygon/mumbai`,
      ]);
    } else {
      this.myProvider = new AngularNetworkProvider([]);
    }
    await this.myProvider.init();

    if (metamaskDeployment == true) {
      console.log('Check if 🦊 injected provider');
      let ethereum = (window as any).ethereum;
      if (!!(window as any).ethereum) {
        let provider = new providers.Web3Provider(ethereum, 'any');
        const signer = provider.getSigner();
        console.log(provider);
        const addresses = await provider.listAccounts();
        console.log(addresses);
        if (addresses.length > 0) {
          const providerNetwork = provider && (await provider.getNetwork());
          this.newWallet = new AngularWallet();

          const myWallet = await this.newWallet.initMeta(signer);
    
          this.fluidumContract = new AngularContract(this.fluidumContractMetadata);
          await this.fluidumContract.init(this.myProvider.Provider, myWallet);
          this.isChainReady.next({
            active: true,
            provider: this.myProvider,
            wallet: this.newWallet,
            contract: this.fluidumContract,
          });
          this.allowedChain = true
          this.injectionProvider= {provider:provider,signer:signer,providerNetwork,found:true}
          this.router.navigate(['/dashboard]'])
          this.isbusySubject.next(false);
        } else {
          this.isbusySubject.next(false);
          this.allowedChain = false
        }
      } else {
        this.allowedChain = false
        this.isbusySubject.next(false);
      }

     

    } else {
      const myWallet = await this.newWallet.init(this.myProvider.Provider);

      this.fluidumContract = new AngularContract(this.fluidumContractMetadata);
      await this.fluidumContract.init(this.myProvider.Provider, myWallet);
      this.isChainReady.next({
        active: true,
        provider: this.myProvider,
        wallet: this.newWallet,
        contract: this.fluidumContract,
      });
      this.isbusySubject.next(false);
    }
  }
}
