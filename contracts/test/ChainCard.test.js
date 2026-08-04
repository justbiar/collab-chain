const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainCard", function () {
  async function deploy() {
    const [owner, relayer, otherRelayer, user] = await ethers.getSigners();
    const ChainCard = await ethers.getContractFactory("ChainCard");
    const contract = await ChainCard.deploy(owner.address, relayer.address);
    return { contract, owner, relayer, otherRelayer, user };
  }

  it("only the minter can mint", async function () {
    const { contract, relayer, otherRelayer, user } = await deploy();

    await expect(
      contract.connect(otherRelayer).mint(user.address, 1, "ipfs://card-1")
    ).to.be.revertedWithCustomError(contract, "NotMinter");

    await contract.connect(relayer).mint(user.address, 1, "ipfs://card-1");
    expect(await contract.ownerOf(1)).to.equal(user.address);
    expect(await contract.tokenURI(1)).to.equal("ipfs://card-1");
  });

  it("cannot mint the same card id twice", async function () {
    const { contract, relayer, user } = await deploy();
    await contract.connect(relayer).mint(user.address, 1, "ipfs://card-1");
    await expect(
      contract.connect(relayer).mint(user.address, 1, "ipfs://card-1")
    ).to.be.reverted;
  });

  it("owner can rotate the minter", async function () {
    const { contract, owner, relayer, otherRelayer, user } = await deploy();
    await contract.connect(owner).setMinter(otherRelayer.address);

    await expect(
      contract.connect(relayer).mint(user.address, 2, "ipfs://card-2")
    ).to.be.revertedWithCustomError(contract, "NotMinter");

    await contract.connect(otherRelayer).mint(user.address, 2, "ipfs://card-2");
    expect(await contract.ownerOf(2)).to.equal(user.address);
  });
});
