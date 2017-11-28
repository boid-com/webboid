<template>
<pre>
  {{mutation}}
</pre>

</template>
<script>

import auth from 'lib/auth/auth';

export default {

  data(){
    return{
      accessToken:""
    }
  },
  mounted() {
    this.$nextTick(() => {
      auth.setToken()
      setTimeout(()=>{
        this.accessToken = auth.getToken()
        console.log(this.accessToken)
      },2000)
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