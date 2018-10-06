// import gql from 'graphql-tag'
function gql (strings) {
  return strings[0]
}

export default {
  user: {
    checkUsername () {
      return gql`
        query User($username: String!) {
          User(username: $username) {
            id
          }
        }
      `
    },
    get () {
      return gql`
        query User($userId: ID!) {
          User(id: $userId) {
            id
            email
            payoutAccount
            username
            image
            tagline
            invited {
              id
            }
            devices {
              type
              id
              name
              status
              powerRatings(last:1){power}
            }
            team {
              id
              name
              image
              owner {
                id
                username
                image
                tagline
              }
            }
            wallet {
              tokens {
                id
                balance
                paid
                tokenType {
                  name
                  image
                  description
                }
              }
            }
            powerRatings(last: 1) {
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
            image
            username
            tagline
            _invitedMeta {
              count
            }
            team {
              id
              name
              image
              meta
              owner {
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
        query Device($deviceId: ID!) {
          Device(id: $deviceId) {
            id
            name
            status
            type
            meta
            wcgid
            powerRatings(last: 1) {
                power
              }
          }
        }
      `
    },
    getByCpid () {
      return gql`
        query Device($cpid: String!) {
          Device(cpid: $cpid) {
            cpid
            id
            owner {
              id
            }
          }
        }
      `
    },
    getByWcgid () {
      return gql`
        query Device($wcgid: String!) {
          Device(wcgid: $wcgid) {
            id
            owner {
              id
            }
          }
        }
      `
    }
  },
  leaderboard: {
    global () {
      return gql`
        query {
          allUsers(orderBy: tPower_DESC, first: 20, filter: { tPower_gt: 0 }) {
            username
            tagline
            tPower
            image
          }
        }
      `
    },
    team () {
      return gql`
        query($teamId:ID!) {
          allUsers(orderBy: tPower_DESC, first: 20, filter: {team:{id:$teamId} }) {
            username
            tagline
            tPower
            image
          }
        }
      `
    },
    teams () {
      return gql`
        query {
          allTeams(orderBy: power_DESC, first: 10) {
            name
            tagline
            power
            id
            image
          }
        }
      `
    }
  },
  team: {
    getByName () {
      return gql`
        query($teamName: String!) {
          Team(name: $teamName) {
            name
            tagline
            social
            id
            power
            image
            meta
            _membersMeta {
              count
            }
            owner {
              powerRatings(last: 1) {
                power
              }
              id
              username
              image
              tagline
            }
          }
        }
      `
    }
  }
}
