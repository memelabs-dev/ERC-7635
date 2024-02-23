require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require('hardhat-gas-reporter');
require("@nomiclabs/hardhat-etherscan");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled: true,
            runs: 100
          },
          viaIR: true
        }
      }
    ]
  },
  networks: {
    hardhat: {
      gas: 13450000,
      gasPrice: 1e9
    }
  },
  mocha: {
    timeout: 200000000
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 1
  }
};

