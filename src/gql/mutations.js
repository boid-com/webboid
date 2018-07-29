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
        mutation($email: String!, $password: String!, $invitedById: ID) {
          signupUser(email: $email, password: $password, invitedById: $invitedById) {
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
        mutation($deviceId: ID!, $status: DeviceStatus) {
          updateDevice(id: $deviceId, status: $status) {
            id
          }
        }
      `
    },
    updateWcgid () {
      return gql`
        mutation($deviceId: ID!, $wcgid: String) {
          updateDevice(id: $deviceId, wcgid: $wcgid) {
            id
          }
        }
      `
    },
    create () {
      return gql`
        mutation($cpid: String, $name: String!, $ownerId: ID, $status: DeviceStatus $type: DeviceType!, $meta: Json) {
          createDevice(cpid: $cpid, name: $name, type: $type, meta: $meta, ownerId: $ownerId, status:$status) {
            id
          }
        }
      `
    },
    add (){
      return gql`
        mutation($type:String $name:String){
          addUserDevice(
            name:$name
            type:$type
          ){
            id
          }
        }
      `
    }
  },
  user: {
    updateProfile () {
      return gql`
        mutation($userId: ID!, $tagline: String, $imageURL: String, $username: String) {
          updateUser(id: $userId, tagline: $tagline, image: $imageURL, username: $username) {
            id
          }
        }
      `
    }
  }
}
