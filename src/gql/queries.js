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
            image
            tagline
            invited{
              id
            }
            devices {
              type
              id
              name
              status
            }
            team {
              id
              name
              image
              ownerId
              meta
            }
            wallet {
              tokens {
                id
                balance
                tokenType{
                  name
                  image
                  description
                }
              }
            }
            powerRatings(last:1){
              power
              meta
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
  },
  leaderboard: {
    global () {
      return gql`
      query($teamId:ID){
        leaderboard(teamId:$teamId){
          users
        }
      }`
    },
    teams () {
      return gql`
      query{
        allTeams(orderBy: power_DESC first:3 filter:{power_gt:0}){
          name
          power
          id
          image
          change24
        }
      }`
    }
  }
}
