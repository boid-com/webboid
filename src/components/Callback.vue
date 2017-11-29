<template>
<pre>
  {{mutation}}
</pre>

</template>
<script>

import auth from 'lib/auth/auth'
import authUser from 'lib/gql/authenticateUser.gql'

export default {

  data(){
    return{
      accessToken:undefined,
      userToken:""
    }
  },
  // apollo:{
  //   userToken:{
  //     mutation:"gql``",
  //     variables(){
  //       return {
  //         accessToken:this.accessToken
  //       }
  //     },
  //     skip(){
  //       return this.accessToken
  //     }
  //   }
  // },
  mounted() {
    this.$nextTick(async() => {
      var accessToken = this.accessToken = await auth.setToken()
      console.log(this.accessToken)
      this.$apollo.mutate({
        mutation:authUser,
        variables:{
          accessToken
        }
      })
      // setIdToken();
      // window.location.href = '/';
    });
  },
  computed:{
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
  }
};
</script>