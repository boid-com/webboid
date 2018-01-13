// import gql from 'graphql-tag'
function gql (strings) { return strings[0] }

export default {
  user: {
    checkUsername () {
      return gql`
        query User($username: String!){
          User(username:$username){
            id
          }
        }`
    },
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
              owner{
                id
                username
                image
                tagline
              }
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
            image
            username
            tagline
            _invitedMeta{
              count
            }
            powerRatings(last:1){
              power
            }
            team{
              id
              name
              image
              owner{
                username
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
  },
  team:{
    getByName(){
      return gql`
      query($teamName:String!){
        Team(name:$teamName){
          name
          id
          power
          image
          owner{
            id
            username
          }
        }
      }
      `
    }
  }
}
