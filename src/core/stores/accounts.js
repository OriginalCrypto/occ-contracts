module.exports = async function getAccounts (web3) {
  return new Promise((resolve, reject) => {
    try {
      web3.eth.getAccounts((error, accounts) => {
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
}
