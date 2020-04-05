import { transactionHeader } from "eosjs/dist/eosjs-serialize"
import { PushTransactionArgs } from "eosjs/dist/eosjs-rpc-interfaces"

const wallet = require('./state').global.transitWallet

const sendTransaction = async actions => {
  const tx = {
    actions,
  }

  let pushTransactionArgs: PushTransactionArgs

  let serverTransactionPushArgs: PushTransactionArgs | undefined
  try {
    serverTransactionPushArgs = await serverSign(tx, transactionHeader)
  } catch (error) {
    console.error(`Error when requesting server signature: `, error.message)
  }

  if (serverTransactionPushArgs) {
    // just to initialize the ABIs and other structures on api
    // https://github.com/EOSIO/eosjs/blob/master/src/eosjs-api.ts#L214-L254
    await wallet.eosApi.transact(tx, {
      ...transactionHeader,
      sign: false,
      broadcast: false,
    })

    // fake requiredKeys to only be user's keys
    const requiredKeys = await wallet.eosApi.signatureProvider.getAvailableKeys()
    // must use server tx here because blocksBehind header might lead to different TAPOS tx header
    const serializedTx = serverTransactionPushArgs.serializedTransaction
    const signArgs = {
      chainId: wallet.eosApi.chainId,
      requiredKeys,
      serializedTransaction: serializedTx,
      abis: [],
    }
    pushTransactionArgs = await wallet.eosApi.signatureProvider.sign(signArgs)
    // add server signature
    pushTransactionArgs.signatures.unshift(
      serverTransactionPushArgs.signatures[0]
    )
  } else {
    // no server response => sign original tx
    pushTransactionArgs = await wallet.eosApi.transact(tx, {
      ...transactionHeader,
      sign: true,
      broadcast: false,
    })
  }

  return wallet.eosApi.pushSignedTransaction(pushTransactionArgs)
}

async function serverSign(
  transaction: any,
  txHeaders: any
): Promise<PushTransactionArgs> {
  // insert your server cosign endpoint here
  const rawResponse = await fetch('http://localhost:3031/api/eos/sign', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tx: transaction, txHeaders }),
  })

  const content = await rawResponse.json()
  if (content.error) throw new Error(content.error)

  const pushTransactionArgs = {
    ...content,
    serializedTransaction: Buffer.from(content.serializedTransaction, `hex`),
  }

  return pushTransactionArgs
}

module.exports = sendTransaction

