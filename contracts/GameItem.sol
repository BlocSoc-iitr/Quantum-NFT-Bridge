// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract GameItem is ERC721URIStorage {
    constructor() ERC721("Quantum-Bridge-NFT", "QBNFT") {}

    function awardItem(
        address player,
        string memory tokenURI,
        uint256 tokenId
    ) public returns (uint256) {
        _mint(player, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
}
