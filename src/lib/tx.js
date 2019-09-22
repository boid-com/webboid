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
          from: data.account.name,
          to: data.account.name,
          quantity: data.stakeAmount.toFixed(4) + " BOID",
          time_limit:0,
          use_staked_balance:false,
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
          from:data.account.name,
          to:data.account.name,
          time_limit:0,
          to_staked_balance:false,
          issuer_unstake:false,
          transfer:false,
          quantity: data.unStakeAmount.toFixed(4) + " BOID"
        }
      }
    ]
  }
}

export default {unstakeTx,stakeTx,taposData}