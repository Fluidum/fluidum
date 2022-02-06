import { Contract, providers, Signer, utils, Wallet } from 'ethers';
import { readFileSync } from 'fs-extra';
import { join } from 'path';
import * as dotenv from 'dotenv';


dotenv.config();
const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd();
const contract_path = join(processDir, contract_path_relative);
const contract_config = JSON.parse(
  readFileSync(join(processDir, 'contract.config.json'), 'utf-8')
) as { [key: string]: any };

const abi = [
  {
    inputs: [
      {
        internalType: 'contract ISuperfluid',
        name: 'host',
        type: 'address',
      },
      {
        internalType: 'contract IConstantFlowAgreementV1',
        name: 'cfa',
        type: 'address',
      },
      {
        internalType: 'contract ISuperToken',
        name: 'acceptedToken',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: '_acceptedToken',
    outputs: [
      {
        internalType: 'contract ISuperToken',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '_superToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_agreementClass',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_ctx',
        type: 'bytes',
      },
    ],
    name: 'afterAgreementCreated',
    outputs: [
      {
        internalType: 'bytes',
        name: 'newCtx',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'afterAgreementTerminated',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '_superToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_agreementClass',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_ctx',
        type: 'bytes',
      },
    ],
    name: 'afterAgreementUpdated',
    outputs: [
      {
        internalType: 'bytes',
        name: 'newCtx',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'beforeAgreementCreated',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'beforeAgreementTerminated',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'beforeAgreementUpdated',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addressToCheck',
        type: 'address',
      },
    ],
    name: 'checkRegistered',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'code',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: 'phoneNumberHash',
        type: 'bytes32',
      },
    ],
    name: 'finishVerification',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newUserAddress',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'phoneNumberHash',
        type: 'bytes32',
      },
    ],
    name: 'mockRegistration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newUserAddress',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'codeHash',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'phoneNumberHash',
        type: 'bytes32',
      },
    ],
    name: 'startVerification',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const tinker = async () => {
  const url = `https://speedy-nodes-nyc.moralis.io/${process.env.MORALISID}/polygon/mumbai`;
  const provider =  await new providers.JsonRpcProvider(url);

  const _wallet = new Wallet(process.env.PRIV_KEY);

  const myWallet = await _wallet.connect(provider);


  const userRegistrationContract = await new Contract(
    '0x27183A941F5Be5F8a17AB5E657a0fC2a9c48b5fd',
    abi,
    myWallet
  );


  const passcode = 'aaaaaaa';
  console.log(passcode)
  const passcodeHash =  utils.keccak256("passcode")
  const phonenumerHash = utils.keccak256("5555555"); 
  console.log(395)
  console.log(phonenumerHash)

  // const result_tx = await userRegistrationContract.functions[
  //   'startVerification'
  // ].apply(this, [
  //   '0x0f1fEe8A923f513d23b4C606C7Ee84AC59e4aBCE',
  //   passcodeHash,
  //   phonenumerHash,
  //   { gasLimit: 10000000 },
  // ]);

  // console.log(result_tx);
  // const result = await result_tx.wait();

  // const transaction_details = result.transactionHash;
  // console.log(transaction_details);
};

tinker()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
