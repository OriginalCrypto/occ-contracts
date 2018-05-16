/* globals artifacts */
/* globals web3 */
/*eslint no-console: ["error", { allow: ["log"] }] */
const { transfer } = require('../src/core/actions/transfer'),
      options = require('../src/core/stores/options'),
      OriginalToken = artifacts.require('OriginalToken')

module.exports = async function (callback) {
  const token = await OriginalToken.deployed(),
        params = [ 'from', 'to', 'value' ],
        args = [ web3, token ]

  for (let i = 0; i < params.length; i++) {
    const param = params[i]
    args.push(options.get(param))

    if (!options.hasValue(param)) {
      console.log(`please provide a ${param}`)
      callback()
      return
    }
  }

  const promise = transfer.apply(null, args)

  promise
    .then(receipt => {
      console.log(receipt)
    })
    .catch(e => {
      console.log(e)
    })
    .finally(() => {
      callback()
    })
}
