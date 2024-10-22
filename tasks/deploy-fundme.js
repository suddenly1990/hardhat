const { task } = require("hardhat/config");

task("deploy-fundme", "Deploys the FundMe contract").setAction(
  async (taskArgs, hre) => {
    console.log("Interacting with FundMe contract");
    const { ethers } = hre;

    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(300);
    await fundMe.waitForDeployment();
    console.log(
      `contract has been deployed successfully, contract address is ${await fundMe.getAddress()}`
    );

    if (
      hre.network.config.chainId == 11155111 &&
      process.env.ETHERSCAN_API_KEY
    ) {
      await fundMe.deploymentTransaction().wait(5);
      console.log("waiting for 5 seconds");
      await verifyContract(hre, await fundMe.getAddress(), [300]);
    } else {
      console.log("etherscan api key not found, skipping verification");
    }

    // 其余的交互逻辑...
  }
);

async function verifyContract(hre, contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

module.exports = {};
