// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    string public baseURI;
    IWhitelist public whitelistContract;
    uint256 public tokenId;
    uint256 public maxTokenIds = 20;
    uint256 public tokenPrice = 0.001 ether;
    bool public isPreSaleStarted;
    uint256 public preSaleEnd;

    constructor(
        string memory baseURI_,
        address _whitelistContractAddress
    ) ERC721("Crypto Devs", "CDS") {
        baseURI = baseURI_;
        whitelistContract = IWhitelist(_whitelistContractAddress);
    }

    receive() external payable {}

    fallback() external payable {}

    // overriding default baseURI function with new one.
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function startPreSale() external virtual onlyOwner {
        isPreSaleStarted = true;
        preSaleEnd = block.timestamp + 5 minutes;
    }

    function preSaleMint() external payable virtual {
        require(
            isPreSaleStarted && block.timestamp < preSaleEnd,
            "Presale Mint is not available"
        );
        require(
            whitelistContract.whitelistedAddresses(msg.sender),
            "You are not Whitelisted"
        );
        require(tokenId < maxTokenIds, "Sold out");
        require(msg.value == tokenPrice, "Insufficient Balance");
        tokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function mint() external payable virtual {
        require(
            isPreSaleStarted && block.timestamp > preSaleEnd,
            "Presale is still in progress"
        );
        require(tokenId < maxTokenIds, "Sold out");
        require(msg.value == tokenPrice, "Insufficient Balance");
        tokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(success, "Transaction Failed");
    }
}
