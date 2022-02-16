// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract QuantumNFT is ERC721 {

    address immutable public _owner;
    mapping(uint256 => string) private _tokenURIs;
    uint256 immutable public _nftPrice;

    constructor(address owner_, uint256 nftPrice_) ERC721("Quantum-Bridge-NFT", "QBNFT") {
        _owner = owner_;
        _nftPrice = nftPrice_;
    }

    modifier onlySystem() {
        require(msg.sender == _owner, "illegal-caller");
        _;
    }

    event UserMintLog (
        address indexed user,
        address indexed owner,
        string indexed tokenURI_
    );

    event SystemMintLog (
        address indexed user,
        address indexed owner,
        uint256 indexed tokenId_
    );

    function systemMint(
        address to_,
        string memory tokenURI,
        uint256 tokenId_
    ) public onlySystem {
        _mint(to_, tokenId_);
        _setTokenURI(tokenId_, tokenURI);
        emit SystemMintLog(msg.sender, to_, tokenId_);
    }

    function userMint(address to_, string memory tokenURI_) public payable {
        require (msg.value >= _nftPrice, "less-amount-paid");
        emit UserMintLog(msg.sender, to_, tokenURI_);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

}
