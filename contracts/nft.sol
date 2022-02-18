// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract QuantumNFT is ERC721 {
    address public immutable _owner;
    uint256 public immutable _nftPrice;

    event UserMintLog(address indexed user, address indexed owner);

    event SystemMintLog(
        address indexed user,
        address indexed owner,
        uint256 indexed tokenId_
    );

    constructor(address owner_, uint256 nftPrice_)
        ERC721("Quantum-Bridge-NFT", "QBNFT")
    {
        _owner = owner_;
        _nftPrice = nftPrice_;
    }

    modifier onlySystem() {
        require(msg.sender == _owner, "illegal-caller");
        _;
    }

    function systemMint(address to_, uint256 tokenId_) public onlySystem {
        _mint(to_, tokenId_);
        emit SystemMintLog(msg.sender, to_, tokenId_);
    }

    function userMint(address to_) public payable {
        require(msg.value >= _nftPrice, "less-amount-paid");
        emit UserMintLog(msg.sender, to_);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "QuantumURI";
    }
}
