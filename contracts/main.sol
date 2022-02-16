//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./events.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface TokenInterface is IERC721 {
    function mint(address to_, uint256 tokenId_) external;
}

contract Quantum is Ownable, Events {
    TokenInterface internal immutable token;
    // Token ID => sender
    mapping(uint256 => address) public _tokenIdToSender;

    function lockNft(address sender_, uint256 tokenId_) internal {
        _tokenIdToSender[tokenId_] = sender_;
        emit lockNftLog(sender_, tokenId_);
    }

    function migrate(uint256 tokenId, address to_) external {
        // user has to call migrate after locking the nft in order to initiate migration
        require(_tokenIdToSender[tokenId] == msg.sender, "illegal-caller");
        emit migrateLog(msg.sender, to_, tokenId);
    }

    function mintNft(address to_, uint256 tokenId_) external onlyOwner {
        if (token.ownerOf(tokenId_) != address(0)) {
            // if token is already minted, means it should be in this contract
            token.safeTransferFrom(address(this), to_, tokenId_);
        } else {
            token.mint(to_, tokenId_);
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

    constructor(address owner_, address tokenAddr_) Ownable() {
        _transferOwnership(owner_);
        token = TokenInterface(tokenAddr_);
    }
}
