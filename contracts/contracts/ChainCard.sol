// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice One NFT per Collab Chain card. Token id == the app's Card.id,
/// so a card can never be minted twice and the mapping back to the app's
/// database is trivial. Minting is gasless for end users — only the app's
/// relayer address can call `mint`, and it pays the gas itself.
contract ChainCard is ERC721, ERC721URIStorage, Ownable {
    address public minter;

    event MinterUpdated(address indexed previousMinter, address indexed newMinter);

    error NotMinter();

    modifier onlyMinter() {
        if (msg.sender != minter) revert NotMinter();
        _;
    }

    constructor(address initialOwner, address initialMinter)
        ERC721("Collab Chain Card", "CHAIN")
        Ownable(initialOwner)
    {
        minter = initialMinter;
        emit MinterUpdated(address(0), initialMinter);
    }

    function setMinter(address newMinter) external onlyOwner {
        emit MinterUpdated(minter, newMinter);
        minter = newMinter;
    }

    function mint(address to, uint256 cardId, string calldata uri) external onlyMinter {
        _safeMint(to, cardId);
        _setTokenURI(cardId, uri);
    }

    // --- Required overrides for the ERC721URIStorage extension ---

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
