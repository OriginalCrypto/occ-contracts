const HDWalletProvider = require("truffle-hdwallet-provider"),
      secret = require('./.mnemonic'),
      infura = require('./.infura'),
      endpoint = infura ? `/${infura.token}` : '',
      notSoSecret = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';

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
      network_id: "4447" // Match any network id
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545, // ganache runs on 7545 by default
      network_id: "5777"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(secret.mnemonic, "https://ropsten.infura.io" + endpoint, 0, 10);
      },
      gas: 2905540,
      network_id: "3"
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(secret.mnemonic, "https://kovan.infura.io" + endpoint, 0, 10);
      },
      network_id: "42"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(secret.mnemonic, "https://rinkeby.infura.io" + endpoint, 0, 10);
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
        return new HDWalletProvider(secret.mnemonic, "https://mainnet.infura.io" + endpoint, 0, 10);
      },
      network_id: "1",
      gasPrice: 21000000000
    }
  }
};

/*
 NETWORK	DESCRIPTION	URL
Mainnet	production network	https://mainnet.infura.io/UuCmoCEeZA811FIwUpIM
Ropsten	test network	https://ropsten.infura.io/UuCmoCEeZA811FIwUpIM
INFURAnet	test network	https://infuranet.infura.io/UuCmoCEeZA811FIwUpIM
Kovan	test network	https://kovan.infura.io/UuCmoCEeZA811FIwUpIM
Rinkeby	test network	https://rinkeby.infura.io/UuCmoCEeZA811FIwUpIM
IPFS	gateway	https://ipfs.infura.io
*/
