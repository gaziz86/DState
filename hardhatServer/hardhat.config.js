require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
const ALCHEMY_RPC_ENDPOINT = process.env.ALCHEMY_RPC_ENDPOINT;


module.exports = {
  solidity: "0.8.17",
  networks: {
    forking: {
      url: ALCHEMY_RPC_ENDPOINT,
    }
  }
};
