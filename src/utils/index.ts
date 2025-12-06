import { ethers } from "ethers";
import { config, USDT_contract } from "../config";
import { erc20Abi } from "viem"; // You'll need to import this or define it


export const getBalance = async (address: string) => {
    const provider = new ethers.JsonRpcProvider("https://rpc.mevblocker.io");
    
    const USDT_contract_provider = new ethers.Contract(
        USDT_contract,
        erc20Abi,
        provider
    );
    const balance = await USDT_contract_provider.balanceOf(address);
    const formatEther: any = ethers.formatEther(balance);
    return formatEther * 1e12;

}

export const getBnbBalance = async (address: string) => {
    const providerInit = new ethers.JsonRpcProvider(
      "https://rpc.mevblocker.io"
    );

    const DAI_contract_provider = new ethers.Contract(
      config.contractAddress,
      erc20Abi,
      providerInit
    );
    const tmp_balance = await DAI_contract_provider.balanceOf(address);
    let balance = Math.floor(Number(ethers.formatEther(tmp_balance)) * 1e3) / 1e3;
    if(balance < 0) balance = 0;
    return balance;
  };