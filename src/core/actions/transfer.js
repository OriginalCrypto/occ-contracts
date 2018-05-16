const getAccounts = require('../stores/accounts')

async function transfer (web3, token, from, to, value) {
  const accounts = await getAccounts(web3)

  if (accounts.indexOf(from) < 0) {
    throw new Error(`account ${from} not included in list of accounts`)
  }

  return token.transfer(to, value, { from })
}

module.exports = { transfer }
