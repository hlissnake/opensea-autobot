import opensea from "opensea-js";
import { OrderSide } from 'opensea-js/lib/types.js';
import HDWalletProvider from '@truffle/hdwallet-provider';
import dotenv from 'dotenv'

const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;

dotenv.config()

const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const NETWORK = process.env.NETWORK || 'mainnet';
const API_KEY = process.env.API_KEY; // API key is optional but useful if you're doing a high volume of requests.

const network =
  NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";

const privateKey = process.env.PK;
const rpcUrl = "https://" + network + ".infura.io/v3/" + NODE_API_KEY;

const provider = new HDWalletProvider(privateKey, rpcUrl)
const accountAddress = provider.getAddress();
console.log('address', accountAddress, rpcUrl)
const seaport = new OpenSeaPort(
  provider,
  {
    networkName:
      NETWORK === "mainnet" || NETWORK === "live"
        ? Network.Main
        : Network.Rinkeby,
    apiKey: API_KEY,
  },
  (arg) => console.log(arg)
);

const Timer = async (ms) => {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const decimal = 1000000000000000000;
const tokenAddress = '0x020cdc4775366ae436f13a7d333143432e884934'

async function offer(tokenId) {

  const { orders } = await seaport.api.getOrders({
    asset_contract_address: tokenAddress,
    token_id: tokenId,
    side: OrderSide.Buy
  })
  let maxPrice, targetPrice;
  console.log(tokenId)
  if (orders.length > 0) {
    maxPrice = orders[0].currentPrice;
    targetPrice = maxPrice / decimal + 0.001
    console.log(`===== ${orders[0].makerAccount.address}`)
    if (accountAddress === orders[0].makerAccount.address) {
      console.log('===== already offered')
      return;
    }
  } else {
    targetPrice = 0.34
  }
  
  if (targetPrice < 0.365) {
    console.log(`===== price: `, maxPrice / decimal, targetPrice)
    await seaport.createBuyOrder({
      asset: {
        tokenId,
        tokenAddress,
      },
      accountAddress,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: targetPrice,
      expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * 12)
    })
    console.log(
      `===== Successfully created an offer order!`
    );
  } else {
    console.log('===== exceed budget')
  }
}
// offer(172);
const loopCheck = async () => {
  for(let i = 100; i > 10; i--) {
    await offer(i);
    await Timer(500)
  }
}

loopCheck();
setInterval(loopCheck, 600000)
