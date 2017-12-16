// import gql from 'graphql-tag'
function gql (strings) { return strings[0] }

export default {
  user: {
    get () {
      return gql`
        query User($userId: ID!) {
          User(id: $userId) {
            id
            email
            username
            devices {
              type
              id
              name
              status
            }
            wallet {
              tokens {
                id
                balance
              }
            }
          }
        }
      `
    },
    getByUsername () {
      return gql`
        query User($username: String!) {
          User(username: $username) {
            id
            email
            username
            devices {
              type
              id
              name
              status
            }
            wallet {
              tokens {
                id
                balance
              }
            }
          }
        }
      `
    }
  },
  device: {
    get () {
      return gql`
        query Device($deviceId:ID!){
          Device(id:$deviceId){
            id
            name
            status
            type
            meta
          }
        }
        `
    }
  }
}
