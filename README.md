# gin-contracts
solidity contracts for a cofounder based ethereum token

-----------------------
GIN is a set of solidity contracts for a cofounder based ethereum [ERC20](https://github.com/ethereum/EIPs/issues/20) token.
Why yet another token? Why not? In all seriousness, while there are many tokens out there that handle the single owner use case, there are few which programmatically express the rules that bind a token (or its founders), particularly if there's more than a single founder.

GIN is such a case. There's a dedicated team of individuals bringing it to fruition, the code that makes up this token reflects that.

GIN's code is written and developed using the [TRUFFLE](http://truffleframework.com/) framework. This means you'll need [Node](https://nodejs.org/). Truffle comes with its own version of [testrpc](https://github.com/trufflesuite/ganache-cli) (there's a GUI version called [Ganache](https://github.com/trufflesuite/ganache) if that's your sort of thing).

### Quick Start

Assuming you have npm (and node) setup, run the following to install truffle.

```
$ npm install -g truffle
```

In the root directory for gin-contracts repository run
```
$ npm install
```

To run the test suite run
```
 $ npm run test
```

### License
MIT

