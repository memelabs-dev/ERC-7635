# ERC8000 
***
ERC8000 is an asset management protocol that inherits ERC721 and encompasses all NFT functionalities, while also implementing multiple slots for asset management. Its core features include:
* MFT Management
  * Flexibly configure MFT transfer permissions, MFT types, and levels.
* Slot Management
  * Flexibly configure slot token types, token addresses, whether they are NFTs, and transfer permissions.
* Asset Management
  * Through slots, support asset management functions for points, ERC20, and ERC721 tokens.
  * Realize asset transfer between MFTs.
  * Realize asset transfer between MFTs and EOA wallets.
  * Flexibly deposit and withdraw tokens in MFT.
* Compatibility and Scalability
  * Fully compatible with the ERC721 protocol, allowing free trading on DEX.
  * Flexible configuration of MFTs and slots, supporting dynamic expansion, and compatible with functional requirements in various scenarios.

## Whitepaper


## Contracts
**[ERC8000](./contracts/ERC8000.sol)**

## Documents

**[Doc](./doc)**


## Usage

### Install

```shell
npm install
```

### Example
```solidity
// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.6;

import "./ERC8000.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TestERC8000 is ERC8000, Ownable {

  uint256 public count;

  // Maximum circulation
  uint256 public maxSupply;

  constructor(
    string memory name_,
    string memory symbol_
  ) ERC8000(name_, symbol_)  {
  }

  /**
   * @dev Set maximum circulation
     * @param maxSupply_ Maximum circulation
     */
  function setMaxSupply(uint256 maxSupply_) external onlyOwner {
    maxSupply = maxSupply_;
  }


  /**
  * @dev Update or add slot information
    * @param slotIndex_ Slot Index
    * @param update_ true for update
    * @param transferable_ true indicates transferable
    * @param isToken_ True indicates  token
    * @param isNft_ True indicates  NFT
    * @param tokenAddress_ ERC20 or ERC721 Token Address
    * @param name_ Slot Name
    */
  function updateSlot(
    uint256 slotIndex_,
    bool update_,
    bool transferable_,
    bool isToken_,
    bool isNft_,
    address tokenAddress_,
    string memory name_
  ) external payable onlyOwner {
    _updateSlot(slotIndex_, update_, transferable_, isToken_, isNft_, tokenAddress_, name_);
  }


  /**
   * @dev mint MFT
     * @param to_ Receiver's address
     * @param tokenLevel_ token level
     * @param tokenType_ token type
     * @param transferable_ true indicates transferable
     */
  function mint(
    address to_,
    uint32 tokenLevel_,
    uint8 tokenType_,
    bool transferable_
  ) external payable onlyOwner {
    require(count < maxSupply, "MFT: max supply reached");

    _mint(to_, ++count, tokenLevel_, tokenType_, transferable_);
  }

}
```

### Run test

```shell
npx hardhat test
```

### Compile

Run `npx hardhat compile`, get build results in `artifacts/contracts` folder, including `ABI` json files.
