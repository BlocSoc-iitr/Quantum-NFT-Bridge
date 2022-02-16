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
    mapping (uint256 => address) internal _tokenIdToSender;

    function lockNft(address sender_, uint256 tokenId_) internal {
        _tokenIdToSender[tokenId_] = sender_;
        emit lockNftLog(sender_, tokenId_);
    }

    function migrate(uint256 tokenId, address to_) external {
        require(_tokenIdToSender[tokenId] == msg.sender, "illegal-caller");
        emit migrateLog(msg.sender, to_, tokenId);
    }

    function mintNft(
        address to_,
        uint256 tokenId_
    ) external onlyOwner {
        if (token.ownerOf(tokenId_) == address(this)) {
            token.safeTransferFrom(address(this), to_, tokenId_);
        } else {
            token.mint(to_, tokenId_);
        }
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
        lockNft(_from, _id);
        return 0x150b7a02;
    }

    constructor(address owner_, address tokenAddr_) Ownable() {
        _transferOwnership(owner_);
        token = TokenInterface(tokenAddr_);
    }

}
