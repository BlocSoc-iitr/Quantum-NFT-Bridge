//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Events {
    event lockNftLog(address indexed owner_, uint256 indexed tokenId_);

    event migrateLog(
        address indexed from_,
        address indexed to_,
        uint256 indexed tokenId_
    );

    event mintLog(address indexed to_, uint256 indexed tokenId_);
}
