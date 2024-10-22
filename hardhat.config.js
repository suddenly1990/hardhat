require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();
require("./tasks");
require("hardhat-deploy");

const { SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY, PRIVATE_KEY_1 } =
  process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  namedAccounts: {
    secondAccount: {
      default: 1, // 这里使用第一个账户作为默认部署账户
    },
    firstAccount: {
      default: 0, // 这里使用第二个账户作为第一个账户
    },
  },
  solidity: "0.8.27",
};
