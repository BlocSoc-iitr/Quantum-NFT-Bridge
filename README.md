# Quantum NFT bridge:

- **Quantum** is a Decentralised NFT cross-chain bridging platform that supports the transfer of NFT minted using Quantum NFT manager.
- Quantum currently support NFT transfer between: 
   - Avalanche (Fuji) -> Ethereum (Kovan)
   - Ethereum (Kovan) -> Avalanche (Fuji)

To run the server:
```js
node  --experimental-json-modules scripts/Sequencer/sequencer.js
```

### How does Quantum works
- User submits their NFT to our Quantum Bridge using the `transferFrom` function.
- When NFT has been received, our Quantum Bridge locks the NFT.
- If the user wants to migrate the NFT, he can migrate it using the `migrate` function, which emits an event.
- Then, our sequencer catches the event and validates all required logic.
- If all the logic is verified, then it processes the minting of NFT on the target chain with the same `metadata` and `tokenID` using nftManager on the target chain.

### How to use Quantum Bridge:
User can easily connect their Metamask wallet with the connect wallet button

![i1](https://user-images.githubusercontent.com/55936621/154795283-6708357c-9ff4-4a1c-b7d7-d80cf714a29e.jpg)

The user can now see the NFTs he/she holds in that wallet as follows

![i2](https://user-images.githubusercontent.com/55936621/154795314-17d12963-3489-4d78-938b-faaa02d2102b.jpg)

If user doesn’t have any NFT then he/she can buy it easily from the ‘Buy NFT’ option on the top right

![i3](https://user-images.githubusercontent.com/55936621/154795342-ebb2acdf-5191-48a5-a9d5-b3f62b913457.jpg)

The next step comes in where the user has to Lock his NFT on the current network that it is minted on. What this does is that it will transfer the NFT to our address.
The ‘Lock NFT’ option is located just beside the Buy NFT button 

![i4](https://user-images.githubusercontent.com/55936621/154795393-5d96df47-cbaf-4e19-817d-967cdbbe1083.jpg)

Once the user has locked the NFT, he can migrate it over to the other chain, in our case Kovan to Fuji or vice versa
We have provided with a Migrate NFT button for this

![i5](https://user-images.githubusercontent.com/55936621/154795418-10383266-bc28-4b9d-9ab7-9da2467f375c.jpg)

User just has to enter his tokenID after connecting to the wallet to transfer the NFTs to other chain.
Let’s have a look at the flow on the back-end in a brief manner below 

![A4 - 1](https://user-images.githubusercontent.com/55936621/154795460-cef9f964-5eff-4f50-985b-faf0f2ec47e0.png)
