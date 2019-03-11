function taposData(data){
  return {
    blocksBehind: 3,
    expireSeconds: 30,
  }
}

function stakeTx(data){
  return {
    actions: [
      {
        account: "boidcomtoken",
        name: "stake",
        authorization: [
          {
            actor: data.account.name,
            permission: data.account.authority
          }
        ],
        data: {
          _stake_account: data.account.name,
          _staked: data.stakeAmount.toFixed(4) + " BOID",
          memo: "BOID token staking"
        }
      }
    ]
  }
}

function unstakeTx(data){
  return {
    actions: [
      {
        account: "boidcomtoken",
        name: "unstake",
        authorization: [
          {
            actor: data.account.name,
            permission: data.account.authority
          }
        ],
        data: {
          _stake_account: data.account.name
        }
      }
    ]
  }
}

export default {unstakeTx,stakeTx,taposData}