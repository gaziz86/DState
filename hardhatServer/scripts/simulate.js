const hre = require("hardhat");
const alch = require("@alch/alchemy-sdk");

require('dotenv').config()
const ALCHEMY_RPC_ENDPOINT = process.env.ALCHEMY_RPC_ENDPOINT;
const alchemy = alch.initializeAlchemy({apiKey: ALCHEMY_RPC_ENDPOINT, network: 5});//new alch.Alchemy({apiKey: ALCHEMY_RPC_ENDPOINT, network: 5});

async function ethers_reset(blockNumber) {

    // get block number (web3)
    // let blockNumber = await hre.network.provider.getBlockNumber();
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

async function main() {

    // ethers_reset();
    const websocketProvider = alchemy.getWebsocketProvider();

    // Subscribe to new blocks, or newHeads
    websocketProvider.on({method: "alchemy_block"},
        (blockNumber) => {
            console.log("Latest block:", blockNumber);
            ethers_reset(blockNumber);
    });

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });