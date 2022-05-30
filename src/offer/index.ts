
import seaport from './client'
import tokenAddress from './brain'
import { getAsset } from './fetch'

// The offerer's wallet address:
const accountAddress = "0xb11E71Cf95231B33ee3c6C56d897b5907470d5D6"

const asset = await getAsset('57', tokenAddress)
console.log(asset)

// const offer = await seaport.createBuyOrder({
//   asset: {
//     tokenId,
//     tokenAddress,
//     schemaName // WyvernSchemaName. If omitted, defaults to 'ERC721'. Other options include 'ERC20' and 'ERC1155'
//   },
//   accountAddress,
//   // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
//   startAmount: 0.1,
// })
