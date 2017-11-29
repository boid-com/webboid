<template lang="pug">
.layout-padding
  h6.text-center Dashboard
  pre {{mutation}}
  
</template>

<script>

export default {
  name: 'index',
  data () {
    return {
    }
  },
  computed: {
    mutation(){
      return `
  # Run this mutation in the Graphcool Playground to authenticate a user

  mutation {
    authenticateUser(
      accessToken: "${this.accessToken}"
    ) {
      id
      token
    }
  }
  `
    }
  

  },
  methods: {
  }
}
</script>

<style lang="stylus">
</style>
