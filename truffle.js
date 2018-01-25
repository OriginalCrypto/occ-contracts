const HDWalletProvider = require("truffle-hdwallet-provider"),
      testMnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  // TODO: add test/production networks
  // and prevent concurrent access to multiple networks
  // see: http://truffleframework.com/docs/advanced/configuration#accessing-only-one-of-multiple-network-providers
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545, // 'truffle develop' runs on 9545 by default
      network_id: "*" // Match any network id
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545, // ganache runs on 7545 by default
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(testMnemonic, "https://ropsten.infura.io");
      },
      network_id: "3"
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(testMnemonic, "kovan.infura.io");
      },
      network_id: "42"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(testMnemonic, "rinkeby.infura.io");
      },
      port: 8545,
      network_id: "4"
    },
    main: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1"
    },
    infura: {
      provider: function() {
        return new HDWalletProvider(testMnemonic, "mainnet.infura.io");
      },
      network_id: "1"
    }
  }
};
