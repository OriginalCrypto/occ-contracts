## How to Script OCC - transfer

<a href="http://www.youtube.com/watch?feature=player_embedded&v=370bNJEqmgY" target="_blank"><img src="http://img.youtube.com/vi/370bNJEqmgY/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

There are a couple of extra files you'll need in order to run, they are plain-text versions of `.infura.js` and `.mnemonic.js` and should be located at the root of the directory.

They should look like this:
#### `.infura.js`
```js
module.exports = { token: 'qwertyqwertyqwery' } 
```

#### `.mnemonic.js`
```js
module.exports = { mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat' }
```

Obviously, the values would need to change from the fake values above.

For [Infura](https://infura.io) head on over to their [signup](https://infura.io/signup) page to get your own token.

For the mnemonic, you'll want to use the HD seed to your hierarchically deterministic wallet. Be sure to keep this secret!

### Preparing to Run
You'll need to download the `occ-contracts` repo. Then install [NodeJS](https://nodejs.org/en/).
You'll also want to install `truffle`:
```bash
$ npm i -g truffle
```

Once all that is done, you'll want to install the dependencies for the repo
```bash
$ npm i
```
### Running the script
```bash
$ truffle exec --network <your desired network name> scripts/transfer.js --from <your sender address> --to <your recipient> --value <some value in wei>
```
*You'll want to make sure that the `--from` address belongs to your seed. The `--to` address can be any valid ethereum address*
*You'll also want to make sure the value is expressed in wei (with enough characters to represent 18 decimal places)*
