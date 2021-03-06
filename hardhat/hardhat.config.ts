import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import { writeFileSync } from 'fs';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  'generate',
  'Create a mnemonic for builder deploys',
  async (_, { ethers }) => {
    const DEBUG = true;
    const bip39 = require('bip39');
    const { hdkey } = require('ethereumjs-wallet');
    const mnemonic = bip39.generateMnemonic();
    if (DEBUG) console.log('mnemonic', mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (DEBUG) console.log('seed', seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    console.log(hdwallet);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    const fullPath = wallet_hdpath + account_index;
    if (DEBUG) console.log('fullPath', fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    console.log(wallet);
    console.log(JSON.stringify(wallet));
    const privateKey = '0x' + wallet.privateKey.toString('hex');
    if (DEBUG) console.log('privateKey', privateKey);
    console.log(privateKey);
    const EthUtil = require('ethereumjs-util');
    const address =
      '0x' + EthUtil.privateToAddress(wallet.privateKey).toString('hex');
    console.log(
      '🔐 Account Generated as ' +
        address +
        ' and set as mnemonic in packages/hardhat'
    );
    console.log(
      "💬 Use 'yarn run account' to get more information about the deployment account."
    );

    writeFileSync('./' + address + '.txt', mnemonic.toString());
    writeFileSync('./mnemonic.txt', mnemonic.toString());
  }
);

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
//const defaultNetwork = 'localhost';

const mainnetGwei = 21;

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  paths: {
    artifacts: '../src/assets/artifacts',
  },
  networks: {
    defaultNetwork: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`, //

      accounts: [process.env.PRIV_KEY],
    },
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: 'http://localhost:8545',
      chainId: 1337,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`, //
      accounts: [process.env.PRIV_KEY],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`, //

      accounts: [process.env.PRIV_KEY],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`, //
      gasPrice: mainnetGwei * 1000000000,
      accounts: [process.env.PRIV_KEY],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`, //
      accounts: [process.env.PRIV_KEY],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`, //

      accounts: [process.env.PRIV_KEY],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/P2lEQkjFdNjdN0M_mpZKB8r3fAa2M0vT`, // <---- YOUR MORALIS ID! (not limited to infura)
      accounts: [process.env.PRIV_KEY],
      gasPrice: 5000000000,
    },
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: 'USD',
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};

export default config;
