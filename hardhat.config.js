require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      url: "https://eth-kovan.alchemyapi.io/v2/zHQ9LKzVTUmjFfzQvl4SpgJVdFX8eNAi",
    },
    kovan: {
      url: "https://eth-kovan.alchemyapi.io/v2/zHQ9LKzVTUmjFfzQvl4SpgJVdFX8eNAi",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
