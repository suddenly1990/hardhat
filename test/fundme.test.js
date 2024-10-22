const { ethers } = require("hardhat");
const { assert } = require("chai");
describe("test FundMe contract", async function () {
  it("test if the owner is mag.sender", async function () {
    const [firstAccount] = await ethers.getSigners();
    console.log(firstAccount.address);
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(180);
    await fundMe.waitForDeployment();
    assert.equal(await fundMe.owner(), firstAccount.address);
  });

  it("test if the datafeed is assined correctly", async function () {
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(180);
    await fundMe.waitForDeployment();
    assert.equal(
      await fundMe.dataFeed(),
      "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    );
  });
});
