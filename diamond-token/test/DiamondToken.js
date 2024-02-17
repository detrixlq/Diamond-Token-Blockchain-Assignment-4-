const { expect } = require("chai");
const hre = require("hardhat");

describe("DiamondToken contract", function() {
  // global vars
  let Token;
  let diamondToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("DiamondToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    diamondToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await diamondToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await diamondToken.balanceOf(owner.address);
      expect(await diamondToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await diamondToken.cap();
      const val = hre.ethers.formatEther(cap);
      expect(Number(val)).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await diamondToken.blockReward();
      const reward = hre.ethers.formatEther(blockReward);
      expect(Number(reward)).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await diamondToken.transfer(addr1.address, 50);
      const addr1Balance = await diamondToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await diamondToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await diamondToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await diamondToken.transfer(addr1.address, 50);
      const addr1Balance = await diamondToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await diamondToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await diamondToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await diamondToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await diamondToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await diamondToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await diamondToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));

      const addr1Balance = await diamondToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await diamondToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
  
});