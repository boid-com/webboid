<template lang="pug">
section.example
  section.container
    section.contract
      h1 Boid Stake, Claim, Unstake
      h5
        | boid Scatter Example
      br
      section(v-if='scatter && account')
        button(@click='stake') Stake
        input(v-model.number='stakeAmount', type='number', placeholder='stake amount')
        input(v-model.number='stakeTime', type='number', placeholder='stake time')
      section(v-if='scatter && account')
        button(@click='unstake') Unstake
      section(v-if='scatter && account')
        button(@click='claim') Claim
      button(@click='login' v-if='scatter && !account') Login with Scatter
      section.logged-in-with(v-if='scatter && account')
        | Logged in with: {{account.name}}
        button.small(@click='logout') Logout
      section(v-if='!scatter')
        | You need Scatter to interact with this website.
        a(href='https://get-scatter.com/' target='_blank') Click here to get it.
</template>

<script>
    // Importing eosjs / Scatter
    import ScatterJS, {Network} from 'scatterjs-core';
    import ScatterEOS from 'scatterjs-plugin-eosjs2';
    import { Api, JsonRpc } from 'eosjs';

    // Adding ScatterJS plugins
    ScatterJS.plugins( new ScatterEOS() );
    
    // MAINNET
    //const network = Network.fromJson({
    //    blockchain:'eos',
    //    host:'nodes.get-scatter.com',
    //    port:443,
    //    protocol:'https',
    //    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' 
    //});

    // JUNGLE
    const network = Network.fromJson({
        blockchain:'eos',
        protocol:'https',
        host:'jungle2.cryptolions.io',
        port:443,
        chainId:'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473' 
    });
    
    let eos;
    const rpc = new JsonRpc(network.fullhost());
    export default {
        data(){return {
            scatter:null,
            stakeAmount:null,
            stakeTime:null
        }},
        mounted(){
            this.setEosInstance();
            ScatterJS.scatter.connect('boid').then(connected => {
                if(!connected){
                    console.error('Could not connect to Scatter.');
                    alert('Could not connect to Scatter, try refreshing the page');
                    return;
                }
                this.scatter = ScatterJS.scatter;
            })
        },
        computed:{
            account(){
                if(!this.scatter || !this.scatter.identity) return null;
                return this.scatter.identity.accounts[0];
            },
        },
        methods:{
            login(){
                this.scatter.getIdentity({accounts:[network]});
            },
            logout(){
                this.scatter.forgetIdentity();
            },
            async stake(){
                const options = { authorization:[`${this.account.name}@${this.account.authority}`] };
                await eos.transact({
                    actions: [{
                        account: 'we3i5kdsdo12',
                        name: 'stake',
                        authorization: [{
                            actor: this.account.name,
                            permission: this.account.authority,
                        }],
                        data: {
                            _stake_account: this.account.name,
                            _stake_period: this.stakeTime,
                            _staked: this.stakeAmount.toFixed(4) + ' BOID',
                            memo: 'memo'
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            },
            async unstake(){
                try {
                    const options = { authorization:[`${this.account.name}@${this.account.authority}`] };
                    await eos.transact({
                            actions: [{
                                account: 'we3i5kdsdo12',
                                name: 'unstake',
                                authorization: [{
                                    actor: this.account.name,
                                    permission: this.account.authority,
                                }],
                                data: {
                                    _stake_account: this.account.name
                                },
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 30,
                        });
                } catch (e) {
                    console.log(e);
                }
            },
            async claim(){
                const options = { authorization:[`${this.account.name}@${this.account.authority}`] };
                await eos.transact({
                    actions: [{
                        account: 'we3i5kdsdo12',
                        name: 'claim',
                        authorization: [{
                            actor: this.account.name,
                            permission: this.account.authority,
                        }],
                    data: {
                        _stake_account: this.account.name
                    },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            },
            setEosInstance(){
                if(this.account){
                    eos = this.scatter.eos(network, Api, {rpc});
                } else {
                    eos = new Api({ rpc });
                }
            },
        },
        watch:{
            ['account'](){
                this.setEosInstance();
            }
        }
    }
</script>

//hello