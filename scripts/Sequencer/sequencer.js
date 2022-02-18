const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

import cron from "node-cron";
const erc721Abi = require("../constants/erc721.json");

const providerKovan = new ethers.providers.JsonRpcProvider(
  "https://eth-kovan.alchemyapi.io/v2/zHQ9LKzVTUmjFfzQvl4SpgJVdFX8eNAi"
);

const providerFuji = new ethers.providers.JsonRpcProvider(
  "https://api.avax-test.network/ext/bc/C/rpc"
);

const accountX = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`).connect(
  providerKovan
);

const accountY = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`).connect(
  providerFuji
);

let nonce = 0;
const idOwnerMap = new Map();

const contractAddress = "";
const contractABI = [];
const contractInstanceChainX = new ethers.Contract(
  contractAddress,
  contractABI,
  providerKovan
);

const contractInstanceChainY = new ethers.Contract(
  contractAddress,
  contractABI,
  providerFuji
);

// deploying for testing
// {
//   const [signer, owner] = ethers.getSigners();
//   const Connector = await ethers.getContractFactory("Quantum");
//   const contractInstanceChainX = await Connector.deploy(owner.address, owner.address);
//   await contractInstanceChainX.deployed();
// }

cron.schedule(`* * * * *`, async () => {
  let filter = contractInstanceChainX.filter.lockNftLog();

  contractInstanceChainX.on(filter, (_from, _id, _nftAddr) => {
    idOwnerMap.set(_id, _from);
  });

  filter = contractInstanceChainX.filter.migrateLog();

  contractInstanceChainX.on(filter, (_from, _to, _tokenId) => {
    expect(
      await contractInstanceChainX._tokenIdToSender(_tokenId)
    ).to.be.not.eq(ethers.constants.AddressZero);
    expect(await contractInstanceChainX._tokenIdToSender(_tokenId)).to.be.eq(
      idOwnerMap.get(_tokenId)
    );
    // mint NFT on the target chain here: avax fuji
    await contractInstanceChainY.connect(accountY).systemMint();
  });
});
