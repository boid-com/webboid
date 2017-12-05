// import gql from 'graphql-tag'
function gql (strings) {
  return strings[0]
}

export default {
  auth: {
    authenticateUser () {
      return gql`
        mutation($email: String!, $password: String!) {
          authenticateUser(email: $email, password: $password) {
            id
            token
          }
        }
      `
    },
    signupUser () {
      return gql`
        mutation($email: String!, $password: String!) {
          signupUser(email: $email, password: $password) {
            id
            token
          }
        }
      `
    }
  },
  device: {
    updateStatus () {
      return gql`
        mutation($deviceId:ID! $status:DeviceStatus){
          updateDevice(
            id:$deviceId
            status:$status
          ){
            id
          }
        }
      `
    }
  }
}
