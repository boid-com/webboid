<template lang="pug">
.relative-position(style="padding: 30px; min-height: 300px; max-width: 460px" v-if="thisUser")
  h4.text-blue(style="margin-bottom: 0px") Update your EOS Account
  h6(style="margin-top: 6px" v-if="page === 0") Tokens earned in Boid are automatically sent to your EOS account.
  br
  .row.justify-center
    q-btn(@click="openURL('https://www.youtube.com/watch?v=VVlGjVDek_M')" color="amber-8" flat) I need help!
  div(style="margin-bottom: 100px" v-if="page === 0")
    .row.justify-center
      div
        p.text-center(v-if="!thisUser.payoutAccount")
        div(v-else)
          br
          p.text-grey-7 Your linked EOS account:
          h5.text-center {{ thisUser.payoutAccount }}
      div(v-if="!thisUser.payoutAccount")
        q-card(color="red-4")
          .row
            .col-auto
              div
                h2(style="margin: 0px; padding-right: 15px; padding-left: 10px") !
            .col
              p You need to link an EOS account to redeem your earnings.
      .row.justify-center(style="padding: 20px")
        p.text-grey-9(style="padding-top: 10px" v-if="!thisUser.payoutAccount") Don't have an EOS account?
        p.text-grey-9(style="padding-top: 10px" v-else) Need a new EOS account?

        p Quickly get an EOS account at #[a(href="https://accounts.boid.com") accounts.boid.com]
      .row.justify-center(v-if="!transitWallet")
        p.text-grey-9 Link your existing EOS account using Scatter
        .row.justify-center
          q-btn(@click="$root.$emit('initTransitWallet')" color="green" style="margin: 20px") Scatter Login
      div(v-else)
        p.text-grey-8 Scatter Identity:
          h4.text-center {{ transitWallet.auth.accountName }}
          .row.justify-center(style="padding: 20px; padding-top: 0px")
            .col
              q-btn.on-left(@click="reLogin()") Link Different EOS Account
            .col(v-if="transitWallet.auth.accountName !== thisUser.payoutAccount")
              q-btn(@click="linkAccount()" color="green") Link this EOS Account

        //- p This EOS account will receive tokens earned from this Boid account.

  div(style="margin-bottom: 100px" v-if="page === 1")
    h6 Great! We sent a confirmation email to you at:
    h5 {{ thisUser.email }}
    h6 You need to click the button in the email.
  .absolute-bottom(style="height: 70px" v-if="page === 0")
    //- q-btn(big style="margin:30px; margin-bottom:30px;" color="green" @click="createRequest()").absolute-bottom-right Link
    q-btn.absolute-bottom-right(@click="thisModal.close()" big color="grey" outline style="margin: 30px; margin-bottom: 30px") Cancel
  .absolute-bottom(style="height: 70px" v-if="page === 1")
    q-btn.absolute-bottom-right(@click="thisModal.close()" big color="blue" style="margin: 30px; margin-bottom: 30px") Confirm by Email
  q-inner-loading(:visible="pending")
    q-spinner-ball(color="blue" size="90px")
</template>
<style lang="stylus">
@import '~variables';

.nueimg {
  padding: 10px;
  width: 160px;
}
</style>
<script>
import { openURL } from "quasar"
export default {
  data() {
    return {
      newPayoutAccount: "",
      page: 0,
      pending: false,
      scatterAuth: null,
      scatterId: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    reLogin() {
      this.transitWallet.terminate()
      setTimeout(el => {
        this.$root.$emit("initTransitWallet")
      }, 1000)
    },
    openURL,
    reset() {
      this.page = 0
      this.newPayoutAccount = ""
    },
    init() {
      this.$root.$on("scatterAuth", data => {
        this.scatterAuth = data
      })
      this.$root.$on("scatterId", data => {
        this.scatterId = data
      })
      this.$root.$on("modal.updatePayout", toggle => {
        if (toggle) {
          this.thisModal.open()
        } else {
          this.thisModal.close()
        }
      })
    },
    async linkAccount() {
      const result = await this.$api.createAccountUpdateRequest({ type: "EOS", newEos: this.transitWallet.auth.accountName })
      if (!result) alert("there was a problem with this request")
      if (result.success) {
        this.page = 1
      }
    },
    modalOpened() {
      console.log("modal open")
      this.reset()
      // window.olark('api.box.hide')
    },
    modalClosed() {
      console.log("modal closed")
      this.reset()
      // window.olark('api.box.show')
    }
  },
  computed: {},
  props: ["thisModal", "api", "thisUser", "transitWallet"],
  watch: {
    thisModal(modal) {
      if (modal) {
        this.thisModal.$on("close", this.modalClosed)
        this.thisModal.$on("open", this.modalOpened)
      }
    },
    thisUser() {}
  }
}
</script>