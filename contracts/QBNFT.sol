// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract QuantumNFT is ERC721 {
    address public _owner;
    mapping(uint256 => string) private _tokenURIs;

    constructor(address owner_) ERC721("Quantum-Bridge-NFT", "QBNFT") {
        _owner = owner_;
    }

    modifier OnlySystem() {
        require(msg.sender == _owner);
        _;
    }

    event logUserMint(
        address indexed user,
        address indexed owner,
        string indexed tokenURI_
    );

    event LogSystemMint(
        address indexed user,
        address indexed owner,
        uint256 indexed tokenId_
    );

    function systemMint(
        address to_,
        string memory tokenURI,
        uint256 tokenId_
    ) public OnlySystem {
        _mint(to_, tokenId_);
        _setTokenURI(tokenId_, tokenURI);
        emit LogSystemMint(msg.sender, to_, tokenId_);
    }

    function userMint(address to_, string memory tokenURI_) public {
        emit logUserMint(msg.sender, to_, tokenURI_);
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
