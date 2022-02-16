pragma solidity ^0.8.0;


contract Events {

    event lockNftLog(address owner_, uint256 tokenId_);

    event migrateLog(address from_, address to_, uint256 tokenId_);

    event mintLog(address to_, uint256 tokenId_);

}