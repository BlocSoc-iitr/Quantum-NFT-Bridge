require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-kovan.alchemyapi.io/v2/zHQ9LKzVTUmjFfzQvl4SpgJVdFX8eNAi",
      },
    },
    kovan: {
      url: "https://eth-kovan.alchemyapi.io/v2/zHQ9LKzVTUmjFfzQvl4SpgJVdFX8eNAi",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 25101000000,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 142101000000,
    },
  },
  etherscan: {
    apiKey: process.env.SCAN_API_KEY,
  },
};
