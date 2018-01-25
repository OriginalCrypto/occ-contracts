# occ-contracts
[ ![Codeship Status for OriginalCrypto/occ-contracts](https://app.codeship.com/projects/8d6b5a90-e3ca-0135-a30d-6e50b47cea82/status?branch=master)](https://app.codeship.com/projects/268666)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![David](https://img.shields.io/david/expressjs/express.svg?style=flat-square)](https://david-dm.org/OriginalCrypto/occ-contracts)
[![GitHub issues](https://img.shields.io/github/issues/OriginalCrypto/occ-contracts/shields.svg?style=flat-square)](https://github.com/ConsenSys/Tokens/issues)

solidity contracts for a cofounder based ethereum token

-----------------------
OCC is a set of solidity contracts for a cofounder based ethereum [ERC20](https://github.com/ethereum/EIPs/issues/20) token.
Why yet another token? Why not? In all seriousness, while there are many tokens out there that handle the single owner use case, there are few which programmatically express the rules that bind a token (or its founders), particularly if there's more than a single founder.

OCC is such a case. There's a dedicated team of individuals bringing it to fruition, the code that makes up this token reflects that.

OCC's code is written and developed using the [TRUFFLE](http://truffleframework.com/) framework. This means you'll need [Node](https://nodejs.org/). Truffle comes with its own version of [testrpc](https://github.com/trufflesuite/ganache-cli) (there's a GUI version called [Ganache](https://github.com/trufflesuite/ganache) if that's your sort of thing).

### Quick Start

Assuming you have npm (and node) setup, run the following to install truffle.

```
$ npm install -g truffle
```

In the root directory for occ-contracts repository run
```
$ npm install
```

To run the test suite start a local blockchain by running:
```
 $ truffle dev
```
then run:
```
 $ npm run test
```
or alternatively you can run:
```
 $ npm run cover
```
which will run [solidity coverage](https://github.com/sc-forks/solidity-coverage) (which has both a local development blockchain and runs the tests concurrently)

---

After a while, one tends to agree (almost wholeheartedly) with this [perspective](https://news.ycombinator.com/item?id=14691212) with regards to Solidity.

### License
MIT

