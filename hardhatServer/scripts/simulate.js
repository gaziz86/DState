const hre = require("hardhat");
require('dotenv').config()
const ALCHEMY_RPC_ENDPOINT = process.env.ALCHEMY_RPC_ENDPOINT;

async function main() {

    // get block number (web3)
    let blockNumber = await hre.network.provider.getBlockNumber();
    console.log("ethers - latest block", blockNumber);

    // reset (ethers)
    await hre.network.provider.request({
        method: "hardhat_reset",
        params: [
            {
                forking: {
                    jsonRpcUrl: ALCHEMY_RPC_ENDPOINT,
                    blockNumber: blockNumber,
                },
            },
        ],
    });
    console.log("ethers - latest block", await hre.network.provider.getBlockNumber());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });