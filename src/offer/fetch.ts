import seaport from "./client"

export const getAsset = async (tokenAddress, tokenId) => {
    return await seaport.api.getAsset({
        tokenAddress, // string
        tokenId, // string | number | null
    })
}
