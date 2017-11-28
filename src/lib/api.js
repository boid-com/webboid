import glob from './globalConfig'
import axios from 'axios'

async function get (string){
  await axios.get(glob.api + 'string').then(response){
    return response
  }.catch(err => { console.error(err) })
}






export default {
  get
}
