const { ethers } = require("hardhat");

async function main() {
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  const fundMe = await fundMeFactory.deploy(300);
  await fundMe.waitForDeployment();
  console.log(
    `contract has been deployed successfully, contract address is ${await fundMe.getAddress()}`
  );
  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    await fundMe.deploymentTransaction().wait(5);
    console.log("waiting for 5 seconds");
    await verifyFundMe(fundMe.target, [300]);
  } else {
    console.log("etherscan api key not found, skipping verification");
  }

  const [first, second] = await ethers.getSigners();
  console.log(first.address, second.address);

  // 获取最小资金要求
  const minimumUsd = await fundMe.MINIMUM_USD();
  console.log(`Minimum USD requirement: ${minimumUsd}`);

  // 计算需要发送的ETH数量（这里我们发送略高于最小要求的金额）
  const ethAmount = (Number(minimumUsd) / 300 + 0.001).toString(); // 300是部署时设置的ETH/USD价格
  console.log(`Sending ${ethAmount} ETH`);

  const fundMeTx = await fundMe.fund({ value: ethers.parseEther(ethAmount) });
  await fundMeTx.wait();
  console.log(`Funded with ${ethAmount} ETH`);

  const balance = await ethers.provider.getBalance(await fundMe.getAddress());
  console.log(`Contract balance is ${ethers.formatEther(balance)} ETH`);

  const fundMeTxWithSecondCount = await fundMe
    .connect(second)
    .fund({ value: ethers.parseEther("0.01") });
  await fundMeTxWithSecondCount.wait();
  console.log("Funded with 0.01 ETH");

  const balanceTwo = await ethers.provider.getBalance(
    await fundMe.getAddress()
  );
  console.log(`contract balance is ${ethers.formatEther(balanceTwo)} ETH`);

  // check mapping
  const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(
    first.address
  );
  const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(
    second.address
  );
  console.log(
    `Balance of first account ${first.address} is ${ethers.formatEther(
      firstAccountBalanceInFundMe
    )} ETH`
  );
  console.log(
    `Balance of second account ${second.address} is ${ethers.formatEther(
      secondAccountBalanceInFundMe
    )} ETH`
  );
}
async function verifyFundMe(fundMeAddr, args) {
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
