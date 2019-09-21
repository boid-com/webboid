<template lang="pug">
div(style="padding:20px; max-width: 1200px;")
  h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") Boid Cloud Device
  .row.justify-center(style="padding:30px;")
    .col-xs-12.col-xl-8
      p.inline You can now rent a cloud server to run the Boid software remotely. A great solution for users who want to increase their Boid Power without purchasing new hardware. The cloud device shows up in your account just like a normal device.
  .row.justify-center(style="min-height:200px;")
    .row(style="max-width:900px;").items-stretch
      .col-12
        q-card
          .light-paragraph.text-center Choose Device Type
          .row              
            .col-auto
              small Provider
              q-btn(flat) Ankr
                img.on-right(src="/statics/ankrlogo.png" style="width:20px; padding-top:0px;")
          .row
            .col-md-3.col-sm-6(v-for="spec of cloudSpecs" :key="spec.id")
              cloudDevice(:device="spec" style="max-width:300px; z-index:100;" @selected="selectCloudSpec" selectable)
      .col-xl-6.col-lg-6
        stakeDiscount()
      .col-xl-6.col-lg-6
        q-card.relative-position
          .light-paragraph.text-center Order Cloud Device
          .row.justify-center(style="padding:10px;")
            small The minimum order length is one week.
          .row.items-center
            .col-auto
              q-btn.weekBtn(:disabled="orderWeeks < 2" round small @click="modifyOrderTime(-1)").bg-green.text-white
                q-icon(name="remove")
            .col-2(style="padding:10px;")
              .row.justify-center 
                small {{printweek}}
              h4.text-center(style="margin:0px;") {{orderWeeks}}
            .col-auto
              q-btn.weekBtn(:disabled="orderWeeks > 7" small round @click="modifyOrderTime(1)").bg-green.text-white
                q-icon(name="add")
            .col
              .row.justify-center 
                small Ending
              div.text-center {{displayEndDate}}
          .row(style="margin:10px;").costrow
            .col-4
              div(style="width:100px; padding:10px;")
                .row.justify-center 
                  .light-paragraph.text-center Base Cost
                div.text-center ${{(baseCost * orderWeeks).toFixed(2)}}
            .col-4
              div(style="width:100px; padding:10px;")
                .row.justify-center 
                  .light-paragraph.text-center Discount
                div.text-center {{discountAmount * 100}}%
            .col-4
              div(style="padding:10px;").bg-blue-6.text-white
                .row.justify-center 
                  .light-paragraph.text-center Final Cost
                .strong.text-center ${{finalCost.toFixed(2)}}
          div(style="padding-top:10px;")
            .light-paragraph.text-center Select Payment Method
            .row.justify-center(style="padding:10px;")
              .col(style="padding:10px;")
                q-btn.full-width(style="padding:10px; padding-bottom:15px;" :class="{selectedpay:selectedPay === 'CUSD'}" @click="selectedPay = 'CUSD'")
                  .row.justify-center
                    .col-12
                      img(src="/statics/carbonlogo.svg" style="width:50px; padding:10px;")
                    .col
                      div CUSD
              .col(style="padding:10px;")
                q-btn.full-width(style="padding:10px; padding-bottom:15px;" :class="{selectedpay:selectedPay === 'EOS'}" @click="selectedPay = 'EOS'")
                  .row.justify-center
                    .col-12
                      img(src="/statics/eoslogoblack.png" style="width:50px; padding:10px;")
                    .col 
                      div EOS
              .col(style="padding:10px;")
                q-btn.full-width( style="padding:10px; padding-bottom:15px;" :class="{selectedpay:selectedPay === 'EOSDT'}" @click="selectedPay = 'EOSDT'")
                  .row.justify-center
                    .col-12
                      img(src="/statics/eosdt.svg" style="width:50px; height:50px; padding:10px;")
                    .col
                      div EOSDT
            div(v-if="finalCost != 0 && selectedPay" style="padding-top:10px; user-select: text;")
              .light-paragraph.text-center Payment Due
              h5.text-center {{printPaymentDue}}

          div(style="height:60px;")
          div.absolute-bottom()
            q-btn(color="green" big @click="showModal = true" :disabled="finalCost === 0 || !selectedPay").full-width Confirm Order
        cloudBoidModal(ref="cloudModal" v-if="showModal")
</template>
<style lang="stylus">
  @import '~variables'
  .selectedpay
    // background-color $green-4
    // color white
    outline 2px solid $green-4
    box-shadow: 0 2px 10px 2px $green-4
  .costrow
    outline 2px solid $blue-6
    outline-offset -1px
  .q-card
    padding 20px !important
    padding-bottom 5px !important
  .weekBtn
    height:10px
    width: 30px
    margin:10px
</style>


<script>
import { openURL, debounce } from 'quasar'
import cloudDevice from '@/cloudDevice.vue'
import stakeDiscount from '@/stakeDiscount.vue'
import cloudBoidModal from '@/cloudBoidModal.vue'

var formatnum = require('format-number')()
function format(data){if (data) return formatnum(parseFloat(data.toFixed(0).replace(/[^0-9.]/g, "")))}

export default {
  data(){
    return {
      cloudSpecs:null,
      selectedCloudSpec:null,
      eosAccount:null,
      checkName:false,
      errormsg:null,
      eosAccountStaked:0,
      discountAmount:0,
      orderWeeks:1,
      orderEndDate:null,
      orderStartDate:()=>{return new Date(Date.now() + 86400000)},
      selectedPay:null,
      eosPrice:null,
      showModal:false,
      selectedDevice:null,
      priceStatsID:null
    }
  },
  props:['thisUser','authenticated'],
  components:{cloudDevice,stakeDiscount,cloudBoidModal},
  async mounted(){
    this.throttledCheck = debounce(this.checkEOSStake,500)
    const priceStats = (await this.$api.getAccountCreateStats())
    this.priceStatsID = priceStats.id
    this.eosPrice = priceStats.results.priceData.eos.usd
    this.cloudSpecs = await this.$api.getCloudSpecs()
    this.orderEndDate = new Date(Date.now() + (this.orderWeeks * 6.048e+8))
  },
  computed:{
    printweek(){
      if (this.orderWeeks > 1) return "weeks"
      else return "week"
    },
    displayEndDate(){
      if (!this.orderEndDate) return
      else return this.orderEndDate.toLocaleDateString()
    },
    baseCost(){
      if (!this.cloudSpecs) return 0
      this.selectedDevice = this.cloudSpecs.find(el => el.id === this.selectedCloudSpec)
      if (!this.selectedDevice) return 0
      const deviceWeeklyCost = this.selectedDevice.coreRate * this.selectedDevice.cores * 24 * 7
      return deviceWeeklyCost
    },
    finalCost(){
      return (this.baseCost * this.orderWeeks - ((this.baseCost * this.orderWeeks ) * this.discountAmount))
    },
    eosCost(){
      if (!this.finalCost || ! this.eosPrice) return 0
      return this.finalCost / this.eosPrice
    },
    printPaymentDue(){
      var payAmount = 0
      if (this.selectedPay === 'EOS') payAmount = (this.eosCost).toFixed(4)
      else payAmount = this.finalCost.toFixed(4)
      return payAmount +" "+ this.selectedPay
    }
  },
  methods:{
    openURL,
    format,
    async checkEOSStake(username){
      if (!username) return this.errormsg = "Enter an EOS account name to check your BOID stake."
      console.log(username)
      const valid = username.search('(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)')
      if (valid != 0) return this.errormsg = "Invalid EOS Account Name"
      try {
        this.checkName = true
        const getStake = await window.eosjs.getStake(username)
        if (getStake && getStake.quantity) {
          this.checkName = false
          return this.eosAccountStaked = parseFloat(getStake.quantity)
          }
        else this.eosAccountStaked = 0
        this.checkName = false
        console.log(getStake)
      } catch (error) {
        console.log(error)
        this.checkName = false
        this.errormsg = null
        this.page = 2
      }
    },
    selectCloudSpec(event){
      this.selectedCloudSpec = event
    },
    modifyOrderTime(val){
      const newTime = this.orderWeeks + val
      if (!newTime >= 1) return
      this.orderWeeks = newTime
      this.orderEndDate = new Date(Date.now() + (this.orderWeeks * 6.048e+8))
    }
  },
  watch:{
    thisUser(user){
      if (!this.eosAccount && user.payoutAccount){
        this.eosAccount = user.payoutAccount
      }
    },
    eosAccountStaked(val){
      if (val >= 1000000) this.discountAmount = 0.1
      else if (val >= 100000) this.discountAmount = 0.05
    },
    eosAccount(val,val2){
      this.errormsg = null
      this.throttledCheck(val)
    },
    showModal(val){
      this.$nextTick(()=>{
        if (val) this.$refs.cloudModal.$refs.modal.open()
      })
    }

  }
}
</script>

