// import gql from 'graphql-tag'
function gql (strings) {
  return strings[0]
}

export default {
  auth: {
    authenticateUser () {
      return gql`
        mutation($accessToken: String!) {
          authenticateUser(accessToken: $accessToken) {
            id
            token
          }
        }
      `
    }
  }
}
