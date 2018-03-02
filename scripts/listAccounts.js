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

  const accounts = await getAccounts(),
        keyPairs = {}


  accounts.forEach((account) => {
    keyPairs[account] = web3.currentProvider.wallets[account].getPrivateKey().toString('hex')
  })
  console.log('accounts: ', keyPairs)

  callback()
}


