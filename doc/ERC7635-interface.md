# ERC7635

## 1. MFT struct definition

### 1.1 TokenData metadata
```solidity
    // token metadata
    struct TokenData {
        // Unique ID of the MFT
        uint256 id;
        // Level of MFT
        uint32 tokenLevel;
        // Type of MFT
        uint8 tokenType;
        // Whether the MFT can be transferred
        bool transferable;
        // The owner of MFT
        address owner;
        // Authorized address of the MFT
        address approved;
    }
```

### 1.2 Slot
```solidity
    // Slot metadata
    struct Slot {
        // slot Whether the asset can be transferred
        bool transferable;
        // Token assets or not: Points, token assets
        bool isToken;
        // True indicates NFT
        bool isNft;
        // If isToken is true, it is the token address, otherwise it is the 0 address
        address tokenAddress;
        // Slot name
        string name;
    }
```


## 2. Write Function
### 2.1 Update or add slot information
```solidity
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
    function _updateSlot(
        uint256 slotIndex_,
        bool update_,
        bool transferable_,
        bool isToken_,
        bool isNft_,
        address tokenAddress_,
        string memory name_
    );
```

### 2.2 Deposit
```solidity
    /**
    * @dev Support ERC20 and ERC721 token deposit, after successful deposit, increase the balance of slot
    * @param _tokenId MFT ID
    * @param _slotIndex Slot index
    * @param _valueOrNftId Number of ERC20 or ID of ERC721
    */
    function deposit(uint256 _tokenId, uint256 _slotIndex, uint256 _valueOrNftId) external payable;
```

### 2.3 Slot approve
```solidity
  /**
     * @notice Allow an operator to manage the value of a token, up to the `_value` amount.
     * @dev MUST revert unless caller is the current owner, an authorized operator, or the approved
     *  address for `_tokenId`.
     *  MUST emit ApprovalValue event.
     * @param _tokenId The token to approve
     * @param _slotIndex The slot to approve
     * @param _operator The operator to be approved
     * @param _value The maximum value of `_toTokenId` that `_operator` is allowed to manage
     */
    function approve(
        uint256 _tokenId,
        uint256 _slotIndex,
        address _operator,
        uint256 _value
    ) external payable;
```

### 2.4 The MFT transfers slot value to other MFTS
```solidity
    /**
    * @dev The MFT transfers slot value to other MFTS
    * @param _fromTokenId MFT ID of the transaction initiator
    * @param _toTokenId MSFT ID of the receiver
    * @param _slotIndex Slot index
    * @param _valueOrNftId Number of ERC20 or ID of ERC721
    */
    function transferFrom(
        uint256 _fromTokenId,
        uint256 _toTokenId,
        uint256 _slotIndex,
        uint256 _valueOrNftId
    ) external payable;
```

### 2.5 Slot transfers to EOA wallet address
```solidity
    /**
    * @dev Slot transfers to EOA wallet address
    * @param _fromTokenId  MFT ID of the transaction initiator
    * @param _toAddress The recipient's wallet address
    * @param _slotIndex Slot index
    * @param _valueOrNftId Number of ERC20 or ID of ERC721
    */
    function transferFrom(
        uint256 _fromTokenId,
        address _toAddress,
        uint256 _slotIndex,
        uint256 _valueOrNftId
    ) external payable;
```

## 3. Read Function

### 3.1 Get the balance of slot
```solidity
   /**
     * @notice Get the balance of slot.
     * @param _tokenId The token for which to query the balance
     * @param _slotIndex The slot for which to query the balance
     * @return The value of `_slotIndex`
     */
    function balanceOf(uint256 _tokenId, uint256 _slotIndex) external view returns (uint256);
```

### 3.2 Gets the number of NFTS in the slot
```solidity
   /**
    * @dev Gets the number of NFTS the slot
    * @param tokenId_ MFT ID
    * @param slotIndex_ Slot index
    */
    function nftBalanceOf(uint256 tokenId_, uint256 slotIndex_) external view returns (uint256[] memory);
```

### 3.3 Get the number of decimals the slot
```solidity
     /**
     * @notice Get the number of decimals the slot
     * @return The number of decimals for value
     */
    function slotDecimals(uint256 _slotIndex) external view returns (uint8);
```

### 3.4 allowance
```solidity
    /**
     * @notice Get the maximum value of a token that an operator is allowed to manage.
     * @param _tokenId The token for which to query the allowance
     * @param _slotIndex The slot for which to query the allowance
     * @param _operator The address of an operator
     * @return The current approval value of `_tokenId` that `_operator` is allowed to manage
     */
    function allowance(uint256 _tokenId, uint256 _slotIndex, address _operator) external view returns (uint256);
```

### 3.5 totalSupply
```solidity
    function totalSupply() public view virtual override returns (uint256);
```