/*globals artifacts */
/*globals web3 */
/*console */
const decimals = 18,
      OriginalToken = artifacts.require('OriginalToken'),
      debug = require('debug')('send')



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
  }

  const getBalance = async function (account) {
    return new Promise((resolve, reject) => {
      try {
        web3.eth.getBalance(account, (error, balance) => {
          if (error) {
            reject(error)
          } else {
            resolve(balance)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  const sendTransaction = async function (account, value) {
    return new Promise((resolve, reject) => {
      try {
        web3.eth.sendTransaction({ to: account, value }, (error, hash) => {
          if (error) {
            reject(error)
          } else {
            resolve(hash)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  const accounts = await getAccounts(),
        mainAccount = accounts[0],
        originalToken = await OriginalToken.deployed(),
        balanceOf = await getBalance(mainAccount),
        occBalanceOf = await originalToken.balanceOf.call(mainAccount)

  debug(`main account: ${mainAccount}`)
  debug(`ether balance: ${balanceOf.times(web3.toBigNumber(`1e-${decimals}`))}`)
  debug(`occ balance: ${occBalanceOf.times(web3.toBigNumber(`1e-${decimals}`))}`)

  const hash = await sendTransaction('0x0', web3.toWei('0.2', 'ether'))

  debug(`transaction: ${hash}`)

  callback()
}


