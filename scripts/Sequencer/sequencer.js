const { expect } = require("chai");
const hre = require("hardhat");
const erc721Abi = require("../constants/erc721.json");
const { ethers } = hre;

const providerKovan = new ethers.providers.JsonRpcProvider(
  "https://eth-kovan.alchemyapi.io/v2/zHQ9LKzVTUmjFfzQvl4SpgJVdFX8eNAi"
);

const providerFuji = new ethers.providers.JsonRpcProvider(
  "https://api.avax-test.network/ext/bc/C/rpc"
);

let nonce = 0;
const idOwnerMap = new Map();
// deploying for testing
{
  const [signer, owner] = ethers.getSigners();

  const Connector = await ethers.getContractFactory("Quantum");
  const contractInstance = await Connector.deploy(owner.address, owner.address);
  await contractInstance.deployed();
}

// const contractAddress = "";
// const contractABI = [];
// const contractInstance = new ethers.Contract(
//   contractAddress,
//   contractABI,
//   providerKovan
// );

let filter = contractInstance.filter.lockNftLog();

contractInstance.on(filter, (_from, _id, _nftAddr) => {
  idOwnerMap.set(_id, _from);
});

filter = contractInstance.filter.migrateLog();

contractInstance.on(filter, (_from, _to, _tokenId) => {
  expect(await contractInstance._tokenIdToSender(_tokenId)).to.be.not.eq(
    ethers.constants.AddressZero
  );
  expect(await contractInstance._tokenIdToSender(_tokenId)).to.be.eq(
    idOwnerMap.get(_tokenId)
  );
  // mint NFT on the target chain here: avax fuji
});
