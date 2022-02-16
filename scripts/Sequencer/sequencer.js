const hre = require("hardhat");
const { ethers } = hre;

const providerKovan = new ethers.providers.JsonRpcProvider(
  "https://eth-kovan.alchemyapi.io/v2/zHQ9LKzVTUmjFfzQvl4SpgJVdFX8eNAi"
);

const contractAddress = "";
const contractABI = [];
const contractInstance = new ethers.Contract(
  contractAddress,
  contractABI,
  providerKovan
);

const filter = contractInstance.filter.Eventname();

contractInstance.on(
  filter,
  (indexed_params = {
    // validate and if everthing is okay, call validators
  })
);
