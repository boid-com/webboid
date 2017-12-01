// import gql from 'graphql-tag'
function gql (strings) {
  return strings[0]
}

export default {
  user: {
    get () {
      return gql`
        query($userId:ID!) {
          User(id: $userId) {
            id
            email
            username
          }
        }
      `
    }
  }
}
