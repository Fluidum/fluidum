import { Contract, providers, Signer, utils, Wallet } from "ethers";
import { readFileSync } from "fs-extra";
import { join } from "path";
import * as dotenv from 'dotenv';
dotenv.config();
const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd()
const contract_path = join(processDir,contract_path_relative)
const contract_config = JSON.parse(readFileSync( join(processDir,'contract.config.json'),'utf-8')) as {[key:string]: any}


const tinker = async () => {


  }
  
  tinker()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });