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
              meta
            }
            wallet {
              tokens {
                id
                balance
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
            powerRatings(last: 1) {
              power
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
          }
        }
      `
    },
    getByCpid () {
      return gql`
        query Device($cpid: String!) {
          Device(cpid: $cpid) {
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
        query($teamId: ID) {
          leaderboard(teamId: $teamId) {
            users
          }
        }
      `
    },
    teams () {
      return gql`
        query {
          allTeams(orderBy: power_DESC, first: 10, filter: { power_gt: 0 }) {
            name
            tagline
            power
            id
            image
            change24
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
