const ecc = require('eosjs-ecc')
// const Hasher = require('./node_modules/scatterjs-core/src/u')

// ecc.randomKey().then(key =>console.log(key))
// const seedPriv = ecc.seedPrivate('okthen')
// console.log(seedPriv)
const sig = "SIG_K1_K9yTLfL1ytmfabvnHSj5uYjTfQDZbBb3s9fCeqP322fvbLkWmkJMf1P88EFUpgnz1VuJu8a7aZKtdu1AXnJCzDcdCzVP4j"
const pub = "EOS7YTk9SCDCfjyWse69v1wxjsn4LPV7VwydpgDsTkPzdoQFJBkA2"
const nonce = "123456789123"
var hash = 
  ecc.sha256(
    ecc.sha256('fuckthis') +
    ecc.sha256(nonce)
  )


const result = ecc.recoverHash(sig, hash)
console.log(result)
console.log(result === pub)
d