const {expect} = require("chai");
const {ethers} = require('hardhat');

describe("MFT", function () {
    let TestERC8000;
    let TestERC20;
    let TestERC721;

    before('deploy', async () => {
        const [deployer] = await ethers.getSigners();

        // ERC20 deploy
        const TestTokenFactory = await ethers.getContractFactory("TestERC20");
        TestERC20 = await TestTokenFactory.connect(deployer).deploy('TEST', 'TEST');

        // ERC721 deploy
        const TestNftFactory = await ethers.getContractFactory("TestERC721");
        TestERC721 = await TestNftFactory.connect(deployer).deploy('TEST', 'TEST');

        // MFT deploy
        const TestERC8000Factory = await ethers.getContractFactory("TestERC8000");
        TestERC8000 = await TestERC8000Factory.connect(deployer).deploy('TestERC8000', 'TestERC8000');

    })

    it('MFT-update', async () => {
        const [deployer, user1, user2] = await ethers.getSigners();

        await TestERC8000.connect(deployer).setMaxSupply(10000);

        // add slot-TestERC20
        await TestERC8000.connect(deployer).updateSlot(1, false, true, true, false, TestERC20.address, 'TEST-TOKEN');
        const slot1 = await TestERC8000.slots(1);
        expect(slot1.tokenAddress).to.eq(TestERC20.address);

        // add slot-TestERC721
        await TestERC8000.connect(deployer).updateSlot(2, false, true, true, true, TestERC721.address, 'TEST-NFT');
        const slot2 = await TestERC8000.slots(2);
        expect(slot2.tokenAddress).to.eq(TestERC721.address);

        // mint MFT
        await TestERC8000.mint(deployer.address, 1, 1, true);
        expect(await TestERC8000.ownerOf(1)).to.eq(deployer.address);

        await TestERC8000.mint(user1.address, 1, 1, true);
        expect(await TestERC8000.ownerOf(2)).to.eq(user1.address);

        await TestERC8000.mint(user2.address, 1, 1, false);
        expect(await TestERC8000.ownerOf(3)).to.eq(user2.address);
    })

    it('mintSoltValue', async () => {
        const [deployer, user1, user2] = await ethers.getSigners();

        // mint erc20
        await TestERC20.connect(deployer).mint(user1.address, 100);

        // mint erc721
        await TestERC721.connect(deployer).mint(user1.address);
        await TestERC721.connect(deployer).mint(user2.address);
        await TestERC721.connect(deployer).mint(user2.address);

        // erc20 approve
        await TestERC20.connect(user1).approve(TestERC8000.address, 100);
        // deposit
        await TestERC8000.connect(user1).deposit(2, 1, 100);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 1)).to.eq(100);

        // ERC721 approve
        await TestERC721.connect(user1).setApprovalForAll(TestERC8000.address, true);
        // deposit
        await TestERC8000.connect(user1).deposit(2, 2, 1);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 2)).to.eq(1);
        // nftBalanceOf
        const nftBalanceOf = await TestERC8000.nftBalanceOf(2, 2)
        console.log('nftBalanceOf', nftBalanceOf)

        // ERC721 approve
        await TestERC721.connect(user2).setApprovalForAll(TestERC8000.address, true);
        // deposit
        await TestERC8000.connect(user2).deposit(3, 2, 2);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](3, 2)).to.eq(1);
        // deposit
        await TestERC8000.connect(user2).deposit(3, 2, 3);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](3, 2)).to.eq(2);
        // nftBalanceOf
        const nftTokensOf2 = await TestERC8000.nftBalanceOf(3, 2)
        console.log('nftTokensOf2', nftTokensOf2)

    })

    it('transferFrom', async () => {
        const [deployer, user1, user2] = await ethers.getSigners();

        // transferFrom user1 to user2
        await TestERC8000.connect(user1)['transferFrom(address,address,uint256)'](user1.address, user2.address, 2);
        expect(await TestERC8000.ownerOf(2)).to.eq(user2.address);

        //  ERC20

        // slotIdex
        await TestERC8000.connect(user2)['transferFrom(uint256,uint256,uint256,uint256)'](2, 3, 1, 10);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 1)).to.eq(100 - 10);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](3, 1)).to.eq(10);

        // tokenAddress_
        await TestERC8000.connect(user2)['transferFrom(uint256,uint256,address,uint256)'](2, 3, TestERC20.address, 10);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 1)).to.eq(100 - 10 - 10);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](3, 1)).to.eq(10 + 10);

        // slot
        expect(await TestERC20['balanceOf(address)'](user2.address)).to.eq('0');
        await TestERC8000.connect(user2)['transferFrom(uint256,address,address,uint256)'](2, user2.address, TestERC20.address, 10);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 1)).to.eq(100 - 10 - 10 - 10);
        await TestERC8000.connect(user2)['transferFrom(uint256,address,uint256,uint256)'](2, user2.address, 1, 10);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 1)).to.eq(100 - 10 - 10 - 10 - 10);

        expect(await TestERC20['balanceOf(address)'](user2.address)).to.eq('20');

        // ERC721
        // slotIdex
        await TestERC8000.connect(user2)['transferFrom(uint256,uint256,uint256,uint256)'](3, 2, 2, 2);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](3, 2)).to.eq(2 - 1);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 2)).to.eq(1 + 1);

        // tokenAddress_
        await TestERC8000.connect(user2)['transferFrom(uint256,uint256,address,uint256)'](3, 2, TestERC721.address, 3);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](3, 2)).to.eq(2 - 1 - 1);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 2)).to.eq(1 + 1 + 1);
        const nftTokensO3 = await TestERC8000.nftBalanceOf(2, 2)
        console.log('nftTokensO3', nftTokensO3)

        // slot
        expect(await TestERC721['balanceOf(address)'](user2.address)).to.eq('0');

        await TestERC8000.connect(user2)['transferFrom(uint256,address,address,uint256)'](2, user2.address, TestERC721.address, 2);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 2)).to.eq(3 - 1);
        await TestERC8000.connect(user2)['transferFrom(uint256,address,uint256,uint256)'](2, user2.address, 2, 3);
        expect(await TestERC8000['balanceOf(uint256,uint256)'](2, 2)).to.eq(3 - 1 - 1);

        expect(await TestERC721['balanceOf(address)'](user2.address)).to.eq('2');

        const nftTokensO4 = await TestERC8000.nftBalanceOf(2, 2)
        console.log('nftTokensO4', nftTokensO4)
    })
});
