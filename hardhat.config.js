require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/ethereum/artifacts",
    sources: "./src/ethereum/contracts",
    cache: "./src/ethereum/cache",
    tests: "./src/ethereum/test"
  },
};
