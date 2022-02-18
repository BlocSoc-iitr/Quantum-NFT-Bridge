// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract QuantumNFT is ERC721, Ownable {
    address public _bridge;
    uint256 public immutable _nftPrice;

    event UserMintLog(address indexed user, address indexed owner);

    event SystemMintLog(
        address indexed user,
        address indexed owner,
        uint256 indexed tokenId_
    );

    constructor(uint256 nftPrice_)
        ERC721("Quantum-Bridge-NFT", "QBNFT")
        Ownable()
    {
        _nftPrice = nftPrice_;
    }

    modifier onlySystem() {
        require(
            msg.sender == owner() || msg.sender == _bridge,
            "illegal-caller"
        );
        _;
    }

    function setBridgeAddr(address bridge_) public onlyOwner {
        _bridge = bridge_;
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
