const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const nftPrice = "1000000000000000";

  const Nft = await ethers.getContractFactory("contracts/nft.sol:QuantumNFT");
  const nft = await Nft.deploy(nftPrice);
  await nft.deployed();

  console.log("NFT deployed: ", nft.address);

  const Quantum = await ethers.getContractFactory(
    "contracts/bridge.sol:Quantum"
  );
  const quantum = await Quantum.deploy(nft.address);
  await quantum.deployed();

  console.log("Quantum deployed: ", quantum.address);

  await nft.setBridgeAddr(quantum.address);

  console.log("Set bridge address");

  await hre.run("verify:verify", {
    address: nft.address,
    constructorArguments: [nftPrice],
    contract: "contracts/nft.sol:QuantumNFT",
  });

  await hre.run("verify:verify", {
    address: quantum.address,
    constructorArguments: [nft.address],
    contract: "contracts/bridge.sol:Quantum",
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
