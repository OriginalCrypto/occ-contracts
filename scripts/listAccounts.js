/* globals web3 */
/* globals artifacts */
/*eslint no-console: ["error", { allow: ["log"] }] */
const OriginalToken = artifacts.require('OriginalToken')

module.exports = async function (callback) {
  const getAccounts = async function () {
    const p = new Promise(function (resolve, reject) {
      try {
        web3.eth.getAccounts(function (error, accounts) {
          if (error) {
            reject(error)
          } else {
            resolve(accounts)
          }
        })
      } catch (e) {
        reject(e)
      }
    })

    return p
  },
  originalToken = await OriginalToken.deployed(),
  accounts = await getAccounts(),
  getBalances = async (accumulator, account, index) => {
    if (typeof accumulator === 'string') {
      return originalToken.balanceOf.call(accumulator)
      .then(balance => {
        balance = balance.div('1e18').toNumber().toLocaleString()
        return [{ index: 0, account: accumulator, balance }]
      })
      .then(results => {
        return originalToken.balanceOf.call(account)
        .then(balance => {
          balance = balance.div('1e18').toNumber().toLocaleString()
          results.push({ index, account, balance })
          return results
        })
      })
    } else {
      return accumulator.then(results => {
        return originalToken.balanceOf.call(account)
        .then(balance => {
          balance = balance.div('1e18').toNumber().toLocaleString()
          results.push({ index, account, balance })
          return results
        })
      })
    }
  }

  accounts.reduce(getBalances) 
  .then(results => {
    console.log('accounts:', JSON.stringify(results, null, 2))
  })

  //web3.currentProvider.wallets[account].getPrivateKey().toString('hex') }

  callback()
}


