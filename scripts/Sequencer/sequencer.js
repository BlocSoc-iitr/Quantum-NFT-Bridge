const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

import cron from "node-cron";

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

const bridgeAddressX = "";
const bridgeAddressY = "";
const nftManagerX = "";
const nftManagerY = "";
const bridgeABI = [];
const nftABI = [];

const bridgeInstanceChainX = new ethers.Contract(
  bridgeAddressX,
  bridgeABI,
  providerKovan
);

const bridgeInstanceChainY = new ethers.Contract(
  bridgeAddressY,
  bridgeABI,
  providerFuji
);

const nftInstanceChainX = new ethers.Contract(
  nftManagerX,
  nftABI,
  providerKovan
);

const nftInstanceChainY = new ethers.Contract(
  nftManagerY,
  nftABI,
  providerFuji
);

let filter1 = bridgeInstanceChainX.filter.lockNftLog();
let filter2 = bridgeInstanceChainX.filter.migrateLog();
let filter3 = bridgeInstanceChainX.filter.migrateLog();

cron.schedule(`* * * * *`, async () => {
  bridgeInstanceChainX.on(filter1, (_from, _id, _nftAddr) => {
    idOwnerMap.set(_id, _from);
  });

  bridgeInstanceChainX.on(filter2, (_from, _to, _tokenId) => {
    expect(await bridgeInstanceChainX._tokenIdToSender(_tokenId)).to.be.not.eq(
      ethers.constants.AddressZero
    );
    expect(await bridgeInstanceChainX._tokenIdToSender(_tokenId)).to.be.eq(
      idOwnerMap.get(_tokenId)
    );
    // mint NFT on the target chain here: avax fuji
    await bridgeInstanceChainY.connect(accountY).systemMint(_tokenId, _to);
  });

  bridgeInstanceChainX.on(filter3, (_from, _to, _tokenId) => {
    expect(await bridgeInstanceChainX._tokenIdToSender(_tokenId)).to.be.not.eq(
      ethers.constants.AddressZero
    );
    expect(await bridgeInstanceChainX._tokenIdToSender(_tokenId)).to.be.eq(
      idOwnerMap.get(_tokenId)
    );
    // mint NFT on the target chain here: avax fuji
    await bridgeInstanceChainY.connect(accountY).systemMint(_tokenId, _to);
  });
});
