# Fluidium

Fluidium, a Dapp Hackathon project that aims to create the right tool to engage mass adoption of money streaming by providing users the ability to stream money to phone numbers.

## Major problems it solves

Currently, dapps are adopted by mainly developers and traders with sufficient blockchain knowledge. If we want to achieve mass adoption, we require that the onboarding step (creating a wallet) is linked with our daily life (phone number). 

Current payment apps (Venmo, Bizum) require digital bank app onboarding, a cumbersome and oftentimes several-day registering process that cannot send real-time payment streams.

Whether streaming money to a software service, paying for energy use, renting out digital real estate, or simply streaming to a friend, we must make the process as seamless and understandable as possible for the average user.

Fluidium seeks to supercharge the superfluid protocol, introducing non-tech/non-trade newcomers to the benefits of blockchain and payment streams. This is possible by creating wallets on the user's behalf quickly (if they choose to and until they're ready to perform tasks on their own) that are linked to their phone number for wallet verifications and notifications, while also educating them throughout the process. As well, we do not have access to their wallet (seed phrase through zk, etc.), only their credentials and public address.
## Answering Questions not yet there

The ability to engage with payment streams in daily activities offers a new world of services and collaborations, which we cannot fully imagine quite yet:
   - Opening a social stream and sharing it in social networks as people plug into the stream
   - Restaurants offering flat rates menus per minute (premium flat rate/natural flat rate)
   - Events that run as long as a volume of common stream is running
   - ...

For each of us though, there is already a question we have to answer in our life... "in which stream do we want to be?" If you are someone who loves to share, who engages with society with the goal to improve lives, then you already are in Fluidium!!!

## Next steps and hackathon decisions

   - For the time being, we only stream with DAI for demonstration purposes. We would obviously expand to include other tokens and allow exchange to stable coins.
   - We plan to create a small fee (around 1/1000) for every stream to fund the project
   - Partner with software providers to experiment with pay-per-use functions through SMS notifications/verification
   - Review the future alternatives to current SMS through cloud function 

   ### use cases
      - Allow to share stream ID to friends/colleagues who can join the stream.
      - Create and stream/event/waiting to have a certain volume to quick off (dynamic crowd funding)


# 🏄‍♂️ Quick Start

## localhost (for now)

Create a copy of /hardhat/sample.env

```javascript
npm run chain
// spin blockchain node on localhost creating 10 accounts and private keys
```

```javascript
npm run watch-contract
// launch, compile, and deploy in watch mode. To deploy on Polygon Testnet, run
npm run watch-contract mumbai
// Mumbai deployment requires free Moralis account
```

```javascript
ng serve -o
// build app and serve on localhost:4200. Alternatively, run
ng serve -o -c mumbai
// to use your configured Mumbai testnet wallet
```

### other helpful commands

```javascript
npm run compile
// compile contracts
```

```javascript
npm run deploy
// deploy contract to localhost. Alternatively you can run
npm run deploy:mumbai
// to deploy on Polygon Testnet
```

## testnet/livenet

Either deploying to localhost node or testnet/cloud the conract has to be compiled

```javascript
npm run compile
// compile the demo app contract in hardhat/contracts/demoContract.sol
```

When compiling, the contract artifacts will be created in the angular project assets folder.

🔏 You can edit your smart contract `.sol` in `/hardhat/contracts` and recompile with same command

Now is time to deploy our contract

```javascript
npm run deploy
// deploy the smartcontract to the chosen network.
```

If you want to deploy to a testnet/mainnet the api and private key have to be configured within hardhat/hardhat.config.ts

💼 You can edit your deployment scripts in `/hardhat/deploy`  
 &nbsp;

Developping in the hardhat network it may be useful to use watch hooks for compiling and deploying, if this is required you can avoid the commands 'compile' and 'deploy' and run in watch mode

```javascript
npm run watch-contract
// launch compile and deploy in watch mode.
```

☠️☠️☠️ Don't do watch mode in mainnet  
⚠️⚠️⚠️ Take care watching in the testnet, test ether is free but you are required to have some  
 &nbsp;  
 **Testing Solidity Contracts**
The schematics also include the hardhat test configuration and infrastructure for solidity contract testing  
 &nbsp;

```javascript
npm run contracts:test
// run the contract tests
```

```javascript
npm run contracts:coverage
// Contracts solidity test coverage analysis
```

&nbsp;
