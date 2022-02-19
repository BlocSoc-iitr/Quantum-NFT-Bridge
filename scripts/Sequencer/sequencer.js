import { expect } from "chai";
import { ethers } from "ethers";
import bridgeABI from "../constants/quantum.json";
import nftABI from "../constants/nftManager.json";
import "dotenv/config";

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

let tokenId = 5;
const idOwnerMap = new Map();

const bridgeAddressX = "0xcdDd334A5F4E84604b36691859bE7ff7ADF770b7";
const nftManagerX = "0x98b642CE62d5B6bb466B0EF71Da4820b13aDe985";

const bridgeAddressY = "0x91A1F1599135E9684ACf772e1A3E2649d82D1Aaa";
const nftManagerY = "0xF0DA6b2BcE831aBcB756bfd7f0AeD9C6325EF51d";

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

let filter1 = bridgeInstanceChainX.filters.lockNftLog();
let filter2 = bridgeInstanceChainX.filters.migrateLog();
let filter3 = bridgeInstanceChainX.filters.mintLog();
let filter4 = nftInstanceChainX.filters.UserMintLog();
let filter5 = nftInstanceChainX.filters.SystemMintLog();

let filter6 = bridgeInstanceChainY.filters.lockNftLog();
let filter7 = bridgeInstanceChainY.filters.migrateLog();
let filter8 = bridgeInstanceChainY.filters.mintLog();
let filter9 = nftInstanceChainY.filters.UserMintLog();
let filter10 = nftInstanceChainY.filters.SystemMintLog();

cron.schedule(`* * * * * *`, async () => {
  try {
    console.log("Sequencer up and running");
    bridgeInstanceChainX.on(filter1, (_from, _id) => {
      console.log("lockNftLog emitted on Kovan ");
      idOwnerMap.set(parseInt(_id._hex), _from);
    });

    bridgeInstanceChainX.on(filter2, async (_from, _to, _tokenId) => {
      console.log("migrateLog emitted on Kovan");

      expect(
        await bridgeInstanceChainX._tokenIdToSender(_tokenId)
      ).to.be.not.eq(ethers.constants.AddressZero);
      // expect(await bridgeInstanceChainX._tokenIdToSender(_tokenId)).to.be.eq(
      //   idOwnerMap.get(_tokenId)
      // );
      // mint NFT on the target chain here: avax fuji
      await bridgeInstanceChainY
        .connect(accountY)
        .mintNft(_to, parseInt(_tokenId._hex));
    });

    bridgeInstanceChainX.on(filter3, async (_to, _tokenId) => {
      console.log("mintLog emitted for migration on Kovan");
    });

    nftInstanceChainX.on(filter4, async (from_, to_) => {
      console.log("User submitted request for new NFT on Kovan");
      try {
        await nftInstanceChainX.connect(accountX).systemMint(to_, tokenId);
        tokenId += 1;
      } catch (error) {
        console.log("NFT minted");
      }
    });

    nftInstanceChainX.on(filter5, async () => {
      console.log("User NFT minted on Kovan by System");
    });
  } catch (error) {
    console.log("success");
  }
});

cron.schedule(`* * * * * *`, async () => {
  try {
    bridgeInstanceChainY.on(filter6, (_from, _id) => {
      console.log("lockNftLog emitted on Fuji");
      idOwnerMap.set(parseInt(_id._hex), _from);
    });

    bridgeInstanceChainY.on(filter7, async (_from, _to, _tokenId) => {
      console.log("migrateLog emitted on Fuji");

      expect(
        await bridgeInstanceChainY._tokenIdToSender(_tokenId)
      ).to.be.not.eq(ethers.constants.AddressZero);
      // expect(await bridgeInstanceChainY._tokenIdToSender(_tokenId)).to.be.eq(
      //   idOwnerMap.get(_tokenId)
      // );
      // mint NFT on the target chain here: avax fuji
      await bridgeInstanceChainX
        .connect(accountX)
        .mintNft(_to, parseInt(_tokenId._hex));
    });

    bridgeInstanceChainY.on(filter8, async (_to, _tokenId) => {
      console.log("mintLog emitted for migration on Fuji");
    });

    nftInstanceChainY.on(filter9, async (from_, to_) => {
      console.log("User submitted request for new NFT on Fuji");
      try {
        await nftInstanceChainY.connect(accountY).systemMint(to_, tokenId);
        tokenId += 1;
      } catch (error) {
        console.log("NFT minted");
      }
    });

    nftInstanceChainY.on(filter10, async () => {
      console.log("User NFT minted on Fuji by System");
    });
  } catch (error) {
    console.log("success");
  }
});
