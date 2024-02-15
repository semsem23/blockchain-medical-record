require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts:'./src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  // add the following configuration for Hardhat Network
  localhost: {
    url: 'http://127.0.0.1:8545', // Hardhat Network default URL
    accounts: {
      mnemonic: 'anchor begin roof length shaft abstract junk south butter issue record smoke', // replace with your own mnemonic
    },
  },
};