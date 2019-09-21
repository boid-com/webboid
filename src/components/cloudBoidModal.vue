<template lang="pug">
  q-modal.relative-position( style="overflow:hidden; user-select: text;" ref="modal" @open="showOlark(false)" @close="showOlark(true),$parent.showModal = false" :no-backdrop-dismiss="true").no-scroll
    div(style="padding:20px; margin:10px; min-content:800px; height:95%; overflow:hidden; max-width:700px;").relative-position.no-scroll
      q-btn.absolute-right(big flat round color="red-5" style="top:-10px;" @click="$refs.modal.close()")
        q-icon(name="close")
      div
        h4.text-blue(style="margin-bottom:0px;") Cloud Device Order &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      div(v-if="page==1" style="overflow:scroll; height:85%;")
        .row
          .col-sm-12.col-lg-6.text-center(style="padding-bottom:5px;")
            p(style="margin-bottom:0px;") Selected Device
              .row.justify-center
                div
                  cloudDevice( small :device="this.$parent.selectedDevice" :selectable="false" style="max-width:200px;")
          .col-sm-12.col-lg-6.text-center
            p Timeframe
            div
              .row.justify-center
                .col.text-center
                  .light-paragraph Start Date
                  div {{$parent.orderStartDate().toLocaleDateString()}}
                .col.text-center
                  .light-paragraph Start Date
                  div {{$parent.orderEndDate.toLocaleDateString()}}
            p(style="padding-top:10px;") Cost
            .row.justify-center
              .col(style='max-width:500px; min-width:300px;')
                .row(style="margin:0px;").costrow
                  .col-4
                    div(style="width:100px; padding:10px;")
                      .row.justify-center 
                        .light-paragraph.text-center Base Cost
                      div.text-center ${{($parent.baseCost * $parent.orderWeeks).toFixed(2)}}
                  .col-4
                    div(style="width:100px; padding:10px;")
                      .row.justify-center 
                        .light-paragraph.text-center Discount
                      div.text-center {{$parent.discountAmount * 100}}%
                        
                  .col-4
                    div(style="padding:10px;").bg-blue-6.text-white
                      .row.justify-center 
                        .light-paragraph.text-center Final Cost
                      .strong.text-center ${{$parent.finalCost.toFixed(2)}}
          .row.justify-center.full-width
            .col(v-if="$parent.eosAccount")
              div(style="padding-top:20px;").text-center Pay From
              .row.justify-center
                small Send payment from this EOS account
              h5.text-center {{$parent.eosAccount}}
            .col
              div(style="padding-top:20px;").text-center Payment Method
              .row.justify-center
                small &nbsp;
              h5.text-center {{$parent.printPaymentDue}}
      div(v-if="page === 2" style="overflow:scroll; height:80%;")
        h4.light-paragraph(style="margin-top:0px;") Terms
        .row.justify-center
          div.bg-white.text-grey-9
            .row
              .col-2.relative-position
                .absolute-center
                  q-icon(name="warning" size="50px;")
              .col
                div( style="padding:10px;" color="white" inverted )
                  q-checkbox(v-model="terms.info" label="Boid Cloud Device is not an investment." color="black")
                  .row
                    small(style="padding:10px; max-width:350px;") Don't order a Boid Cloud device for speculative purposes. There is no guarantee or expectation of profitability from this order.
          div.bg-white.text-grey-9
            .row
              .col-2.relative-position
                .absolute-center
                  q-icon(name="info" size="50px;")
              .col
                div( style="padding:10px;" color="black" inverted )
                  q-checkbox(v-model="terms.refund" label="Boid Cloud Device is still in an alpha stage." color="black")
                  .row
                    small(style="padding:10px; max-width:350px;") If you aren't happy with your order you can contact us at support@boid.com for a refund or an order extension at no additional cost.
          div.bg-white.text-grey-9
            .row
              .col-2.relative-position
                .absolute-center
                  q-icon(name="hourglass_full" size="50px;")
              .col
                div( style="padding:10px;" color="black" inverted )
                  q-checkbox(v-model="terms.availability" label="Boid Cloud Device availibility is limited." color="black")
                  .row
                    small(style="padding:10px; max-width:350px;") The Cloud Device will be added to your account within 24 hours of your order. If your order is unable to be filled for any reason, you will receive a full refund.
      div(v-if="page === 3" style="overflow:scroll; height:80%;")
        h4.light-paragraph Send Payment
        div You can send the payment using any EOS wallet. 
        div We have emailed this information to {{$parent.thisUser.email}}
        h5 Amount
        div.relative-position(style="min-height:32px;")
          h5.text-center {{amountString}}
          q-inner-loading(:visible="memoLoading")
            q-spinner-ball(size="60px" color="blue")
        h5 Memo
        div.relative-position(style="min-height:32px;")
          h5(style="user-select: text;").text-center {{orderMemo}}
          q-inner-loading(:visible="memoLoading")
            q-spinner-ball(size="60px" color="blue")
        p You must include this memo when sending the payment.
        h5 To
        h5.text-center boidclouddev
        div(v-if="$parent.discountAmount > 0")
          h5 From
          h5.text-center {{$parent.eosAccount}}
          p You must send the payment from this EOS account.
        div(style="max-width:400px; padding-top:20px;")
          p The Boid Cloud Device will be added to your account within 24 hours after the payment is received.
      div(style="height:70px;")
      div.absolute-bottom(style="margin:20px; height:30px;" v-if="page===1")
        .row.justify-center
          q-btn.on-left(flat color="grey-8" @click="showOlark(true),$refs.modal.close()") Back
          q-btn(@click="page=2" color="green") Confirm
      div.absolute-bottom(style="margin:20px; height:30px;" v-if="page===2")
        .row.justify-center
          q-btn.on-left(flat color="grey-8" @click="page=1") Back
          q-btn(@click="initializeOrder()" color="green" :disabled="!verified") Continue
      div.absolute-bottom(style="margin:20px; height:30px;" v-if="page===3")
        .row.justify-center
          q-btn.on-left(color="blue" @click="sendUsingScatter()") Send Using Scatter
          q-btn(@click="page=3" color="green" :disabled="!allowFinish") Finish
</template>

<script>
import cloudDevice from '@/cloudDevice.vue'



export default {
  components:{cloudDevice},
  data(){
    return {
      page:1,
      allowFinish:false,
      orderMemo:null,
      memoLoading:true,
      amountString:null,
      terms:{
        info:false,
        refund:false,
        availability:false
      }
    }
  },
  mounted(){
    this.terms = {
      info:true,
      refund:true,
      availability:true
    }
  },
  computed:{
    verified(){return Object.values(this.terms).every(el => el)}
  },
  methods:{
    showOlark:window.showOlark,
    async initializeOrder(){
      setTimeout(()=>{this.allowFinish = true},5000)
      this.page = 3
      this.memoLoading = true
      const result = await this.$api.createCloudDeviceOrder({
        spec:this.$parent.selectedCloudSpec,
        startTime: this.$parent.orderStartDate(),
        orderWeeks:this.$parent.orderWeeks,
        payment:{
          type:this.$parent.selectedPay,
          priceStats:this.$parent.priceStatsID,
          from: this.$parent.eosAccount
        }
      })
      this.memoLoading = false
      this.orderMemo = result.payment.id
      this.amountString = result.payment.amount.toFixed(4) + " " + result.payment.type
    }
  },
  watch:{
  
  }

}
</script>

<style lang="stylus" scoped>

</style>