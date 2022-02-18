//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface TokenInterface is IERC721 {
    function systemMint(address to_, uint256 tokenId_) external;
}

contract Quantum is Ownable {
    TokenInterface internal immutable token;
    // Token ID => sender
    mapping(uint256 => address) public _tokenIdToSender;

    event lockNftLog(address indexed owner_, uint256 indexed tokenId_);

    event migrateLog(
        address indexed from_,
        address indexed to_,
        uint256 indexed tokenId_
    );

    event mintLog(address indexed to_, uint256 indexed tokenId_);

    constructor(address tokenAddr_) Ownable() {
        token = TokenInterface(tokenAddr_);
    }

    function lockNft(address sender_, uint256 tokenId_) internal {
        _tokenIdToSender[tokenId_] = sender_;
        emit lockNftLog(sender_, tokenId_);
    }

    // user has to call migrate after locking the nft in order to initiate migration
    function migrate(uint256 tokenId_, address to_) external {
        require(_tokenIdToSender[tokenId_] == msg.sender, "illegal-caller");
        emit migrateLog(msg.sender, to_, tokenId_);
    }

    function mintNft(address to_, uint256 tokenId_) external onlyOwner {
        if (token.ownerOf(tokenId_) != address(0)) {
            // if token is already minted, means it should be in this contract
            token.safeTransferFrom(address(this), to_, tokenId_);
            delete _tokenIdToSender[tokenId_];
        } else {
            token.systemMint(to_, tokenId_);
        }
        emit mintLog(to_, tokenId_);
    }

    /**
     * @dev Triggers when an ERC721 token receives to this contract.
     * @param _operator Person who initiated the transfer of NFT.
     * @param _from owner of NFT.
     * @param _id ID of NFT.
     */
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _id,
        bytes calldata
    ) external returns (bytes4) {
        require(msg.sender == address(token), "non-quantum-supported-nft");
        lockNft(_from, _id); // sending nft to this contract means locking it.
        return 0x150b7a02;
    }
}
