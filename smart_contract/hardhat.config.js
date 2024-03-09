require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",

  networks:{
    sepolia:{
      url : "https://sepolia.infura.io/v3/################",
      accounts: [process.env.METAMASK_PRIVATE_KEY],
      timeout: 200000,
    }
  }
};