module.exports = async ({ getNamedAccounts, deployments }) => {
  const { firstAccount, secondAccount } = await getNamedAccounts();
  const { deploy, log } = deployments;

  console.log(
    `Deployer account is ${firstAccount} second account is ${secondAccount}`
  );
  console.log("Deploying contract...");

  const fundMe = await deploy("FundMe", {
    from: firstAccount,
    args: [180],
    log: true,
  });
  // 这里添加实际的部署逻辑
  // 例如：
  // const fundMe = await deploy("FundMe", {
  //   from: deployer,
  //   args: [/* 构造函数参数 */],
  //   log: true,
  // });

  // log(`FundMe deployed at ${fundMe.address}`);
};

module.exports.tags = ["all", "fundme"];
