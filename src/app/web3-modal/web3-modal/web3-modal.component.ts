import { DOCUMENT } from '@angular/common';

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { providers } from 'ethers';
declare global {
  interface Window {
    Web3Modal: any;
    WalletConnectProvider: any;
    Fortmatic: any;
    evmChains: any;
    Portis: any;
    walletLinkProvider: any;
    Authereum: any;
    Torus: any;
    WalletLink: any;
  }
}
// const Web3Modal = window.Web3Modal.default;
// const WalletConnectProvider = window.WalletConnectProvider.default;
// const Fortmatic = window.Fortmatic;
// const Portis = window.Portis;
// const evmChains = window.evmChains;
// const walletLinkProvider = window.walletLinkProvider;
// const Authereum = window.Authereum;
const INFURA_ID = '212d29e8e6d145d78a350b2971f326be';

export enum WALLET_PROVIDERS {
  WalletConnectProvider = 'WalletConnectProvider',
  evmChains = 'evmChains',
  Fortmatic = 'Fortmatic',
  Portis = 'Portis',
  WalletLink = 'WalletLink',
  Authereum = 'Authereum ',
}

@Component({
  selector: 'web3-modal',
  templateUrl: './web3-modal.component.html',
  styleUrls: ['./web3-modal.component.css'],
})
export class Web3ModalComponent implements AfterViewInit {
  status = { connected: false, network: 'noop' };
  busy = true;
  options: { [key: string]: { loaded: boolean; scriptTag: string } } = {
    WalletConnectProvider: {
      loaded: false,
      scriptTag: 'https://unpkg.com/web3modal@1.9.0/dist/index.js',
    },
    evmChains: {
      loaded: false,
      scriptTag: 'https://unpkg.com/evm-chains@0.2.0/dist/umd/index.min.js',
    },
    web3Provider: {
      loaded: false,
      scriptTag:
        'https://unpkg.com/@walletconnect/web3-provider@1.2.1/dist/umd/index.min.js',
    },

    // Fortmatic: {
    //   loaded: false,
    //   scriptTag: 'https://unpkg.com/fortmatic@2.0.6/dist/fortmatic.js',
    // },
    // Portis: { loaded: false, scriptTag: 'https://unpkg.com/@portis/web3' },
    // WalletLink: {
    //   loaded: false,
    //   scriptTag: 'https://www.unpkg.com/browse/walletlink@2.0.2/dist/index.js'
    // },
    // Authereum: {
    //   loaded: false,
    //   scriptTag: 'https://unpkg.com/authereum@latest/authereum.js',
    // },
    // Torus: {
    //   loaded: false,
    //   scriptTag: 'https://cdn.jsdelivr.net/npm/@toruslabs/torus-embed',
    // },
  };
  loading: boolean = true;
  public connected: boolean = false;
  web3Modal: any;

  constructor(
    @Inject(DOCUMENT) private readonly document: any) {
      console.log(this.network)
    }

  @Output() onConnect: EventEmitter<any> = new EventEmitter();
  @Output() onDisConnect: EventEmitter<void> = new EventEmitter();
  @Input() public providerArray: Array<string> = [];

  @Input() public network!: string;
  @Input () public injectionProvider!: any;

  createWeb3Modal() {
    try {
      this.web3Modal = new window.Web3Modal.default({
        network: 'mainnet', // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
        cacheProvider: true, // optional
        theme: 'light', // optional. Change to "dark" for a dark theme.
        providerOptions: {
          walletconnect: {
            package: window.WalletConnectProvider.default, // required
            options: {
              bridge: 'https://polygon.bridge.walletconnect.org',
              infuraId: INFURA_ID,
              rpc: {
                1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet
                3: `https://ropsten.infura.io/v3/${INFURA_ID}`,
                42: `https://kovan.infura.io/v3/${INFURA_ID}`,
                100: 'https://dai.poa.network', // xDai
              },
            },
          },
          portis: {
            display: {
              logo: 'https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png',
              name: 'Portis',
              description: 'Connect to Portis App',
            },
            package: window.Portis,
            options: {
              id: 'e658b463-60fd-46ee-b6f2-f8b694eaafec',
            },
          },
          fortmatic: {
            package: window.Fortmatic, // required
            options: {
              key: 'pk_live_CF5B363940938ED5', // required
            },
          },
          torus: {
            package: window.Torus,
            options: {
              networkParams: {
                host: 'https://localhost:8545', // optional
                chainId: 1337, // optional
                networkId: 1337, // optional
              },
              config: {
                buildEnv: 'development', // optional
              },
            },
          },
          // 'custom-walletlink': {
          //   display: {
          //     logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
          //     name: 'Coinbase',
          //     description: 'Connect to Coinbase Wallet (not Coinbase App)',
          //   },
          //   package: walletLinkProvider,
          //   connector: async (provider:any, _options:any) => {
          //     await provider.enable();
          //     return provider;
          //   },
          // },
          authereum: {
            package: window.Authereum, // required
          },
        },
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async web3modalAction(event: any) {
    console.log(event);
    if (event == false) {
      console.log('false')
      await this.logoutOfWeb3Modal();
    } else if (event == true) {
      await this.connectWallet();
    }
  }

  logoutOfWeb3Modal = async () => {
    if (this.web3Modal === undefined) {
      this.createWeb3Modal();
    }

    await this.web3Modal.clearCachedProvider();
    console.log(this.injectionProvider.signer)

   
    if (this.injectionProvider && this.injectionProvider.provider && typeof this.injectionProvider.provider.disconnect == "function") {
      console.log('falseXXXXXX')
       await this.injectionProvider.provider.disconnect();
     }
    this.onDisConnect.emit();
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1);
  };

  async connectWallet() {
    // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required

    if (this.web3Modal === undefined) {
      this.createWeb3Modal();
    }

    if (this.providerArray.length == 0) {
      return;
    }
    console.log('hoal')
    const provider = await this.web3Modal.connect();
    console.log(provider)
    this.onConnect.emit(provider);
    location.reload();
    this.createProviderHooks(provider);
  }

  createProviderHooks(provider: any) {
    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts: string[]) => {
      console.log(accounts);
      location.reload();
    });

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId: number) => {
      location.reload();
    });

    // Subscribe to provider connection
    provider.on('connect', (info: { chainId: number }) => {
      console.log(info);
      this.onConnect.emit(provider);
      location.reload();
    });

    // Subscribe to provider disconnection
    provider.on('disconnect', (error: { code: number; message: string }) => {
      console.log(error);
      location.reload();
    });
  }

  ngAfterViewInit(): void {
    this.loadWallets();
    this.connected = this.injectionProvider.found
  }

  async loadWallets() {
    this.loading = true;
    this.providerArray = [
      'WalletConnectProvider',
      'evmChains',
      'web3Provider',
      // 'Fortmatic',
      // 'Portis',
      // 'Authereum',
      // 'Torus',
    ];

    // const promisesArray = [];

    //promisesArray.push(myPromise1)
    const myArray = this.providerArray
      .map((map) => {
        return { ...{ name: map }, ...this.options[map] };
      })
      .filter((fil) => fil.loaded == false);

    const myPromises: any[] = [];
    for (const mapy of myArray) {
      const myPromise = new Promise<void>((resolve, reject) => {
        let script = this.document.createElement('script');
        try {
          script.type = 'text/javascript';
          script.async = true;
          script.id = mapy.name;
          script.src = mapy.scriptTag;
          script.onload = () => {
            console.log(mapy.name);
            resolve();
          };
          this.document.body.appendChild(script);
        } catch (error) {
          reject();
          console.log(error);
        }
      });
    }

    await Promise.all(myPromises)
      .then(() => {
        setTimeout(async () => {
          // this.Web3Modal = window.Web3Modal.default;on
          this.busy = false;
          const provider = new providers.Web3Provider((window as any).ethereum);
          const addresses = await provider.listAccounts();
          // it doesn't create metamask popup
          if (addresses.length) {
            console.log('ok');
            console.log(await provider.getNetwork());
            this.status.network = (await provider.getNetwork()).name;
            this.createProviderHooks((window as any).ethereum);
            console.log(this.status.network);
            this.status.connected = true;
          }

          // permission already granted so request account address from metamask
          else {
            console.log('okmoooopd');
          }
        }, 100);
      })
      .catch((error) => console.log(error));
    //
  }
}
