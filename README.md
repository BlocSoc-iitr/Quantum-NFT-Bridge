# Quantum NFT bridge:

- **Quantum** is a Decentralised NFT cross-chain bridging platform that supports the transfer of NFT minted using Quantum NFT manager.
- Quantum currently support NFT transfer between: 
   - Avalanche (Fuji) -> Ethereum (Kovan)
   - Ethereum (Kovan) -> Avalanche (Fuji)

### How does Quantum works
- User submits their NFT to our Quantum Bridge using the `transferFrom` function.
- When NFT has been received, our Quantum Bridge locks the NFT.
- If the user wants to migrate the NFT, he can migrate it using the `migrate` function, which emits an event.
- Then, our sequencer catches the event and validates all required logic.
- If all the logic is verified, then it processes the minting of NFT on the target chain with the same `metadata` and `tokenID` using nftManager on the target chain.

### How to use Quantum Bridge:
