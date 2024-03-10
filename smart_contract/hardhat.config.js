require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",

  networks:{
    sepolia:{
      url : "https://sepolia.infura.io/v3/e790c264beac4cc891122c485e3b9cdd",
      accounts: ['f0fb3c22d4dcf386bbee36c1af328ff663acac380c3c8234392b8a275097c998'],
      timeout: 200000,
    }
  }
};