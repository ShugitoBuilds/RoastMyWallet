// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RoastNFT
 * @dev NFT contract for minting roast certificates on Base
 * @notice Users pay 2 USDC to mint their roast as an NFT
 */
contract RoastNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // USDC contract address on Base
    IERC20 public constant USDC = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    
    // Mint price: 2 USDC (6 decimals)
    uint256 public constant MINT_PRICE = 2 * 10**6;

    // Payment recipient
    address public paymentRecipient;

    // Events
    event RoastMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event PaymentRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);

    constructor(address _paymentRecipient) ERC721("Roast My Wallet", "ROAST") Ownable(msg.sender) {
        require(_paymentRecipient != address(0), "Invalid payment recipient");
        paymentRecipient = _paymentRecipient;
    }

    /**
     * @dev Mint a roast NFT
     * @param to Address to mint the NFT to
     * @param uri Token URI pointing to the roast metadata/image
     */
    function mint(address to, string memory uri) public returns (uint256) {
        // Transfer USDC from sender to payment recipient
        require(
            USDC.transferFrom(msg.sender, paymentRecipient, MINT_PRICE),
            "USDC transfer failed"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit RoastMinted(to, tokenId, uri);

        return tokenId;
    }

    /**
     * @dev Get the total number of minted NFTs
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Update the payment recipient (owner only)
     */
    function setPaymentRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid payment recipient");
        address oldRecipient = paymentRecipient;
        paymentRecipient = _newRecipient;
        emit PaymentRecipientUpdated(oldRecipient, _newRecipient);
    }

    /**
     * @dev Withdraw any accidentally sent ETH (owner only)
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        (bool success, ) = paymentRecipient.call{value: balance}("");
        require(success, "ETH transfer failed");
    }

    /**
     * @dev Withdraw any accidentally sent ERC20 tokens (owner only)
     */
    function withdrawERC20(address token) external onlyOwner {
        IERC20 erc20 = IERC20(token);
        uint256 balance = erc20.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(erc20.transfer(paymentRecipient, balance), "Token transfer failed");
    }

    // Required overrides
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

/*
DEPLOYMENT INSTRUCTIONS:

1. Install dependencies:
   npm install @openzeppelin/contracts

2. Deploy to Base using Foundry, Hardhat, or Remix:
   - Set constructor parameter: _paymentRecipient = your wallet address
   - Verify contract on BaseScan

3. After deployment:
   - Save the contract address to NEXT_PUBLIC_ROAST_NFT_ADDRESS env var
   - Users need to approve USDC spending before minting

VERIFICATION:
npx hardhat verify --network base <CONTRACT_ADDRESS> <PAYMENT_RECIPIENT_ADDRESS>
*/



