// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameItem is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    address private _owner;

    constructor() ERC721("Quantum-Bridge-NFT", "QBNFT") {
        _tokenIds = 0;
    }

    function getTokenId() public view onlyOwner returns (uint256) {
        return _tokenIds;
    }

    function systemMint(
        address player,
        string memory tokenURI,
        uint256 tokenId
    ) public returns (uint256) {
        require(tokenId > _tokenIds, "Choose a greater integer for tokenId");
        _mint(player, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _tokenIds = tokenId + 1;
        return tokenId;
    }

    function userMint(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        _mint(player, _tokenIds);
        _setTokenURI(_tokenIds, tokenURI);
        _tokenIds++;
        return _tokenIds - 1;
    }
}
