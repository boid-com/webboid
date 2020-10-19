import Vue from 'vue'
import VueRouter from 'vue-router'

const Index = () => import('@/Index')
const User = () => import('@/User')
const Team = () => import('@/Team')
const Leaderboards = () => import('@/Leaderboards')
const Device = () => import('@/Device')
const Device2 = () => import('@/Device2')
const Auth = () => import('@/Auth')
const Bus = () => import('@/Bus')
const Stake = () => import('@/Stake')
const CreateEOSAccount = () => import('@/CreateEOSAccount')
const ChangeAccount = () => import('@/ChangeAccount')
const CloudBoid = () => import('@/CloudBoid')
const SeasonPass = () => import('@/SeasonPass')
const vote = () => import('@/vote')

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  scrollBehavior: (to,from) => {
    if (to.path === from.path) return
    else return { y: 0 }
  },

  routes: [
    { path: '/', component: Index, name: 'Index' },
    { path: '/confirmPayoutAccount/:requestId/:accountName', component: Index, name:'confirmPayoutAccount'},
    { path: '/u/:username?', component: User, name: 'User' },
    { path: '/t/:teamname?', component: Team, name: 'Team' },
    { path: '/leaderboards/', component: Leaderboards, name: 'Leaderboards' },
    { path: '/device/', component: Device, name: 'Device' },
    { path: '/desktop2/', component: Device2, name: 'Device2' },
    { path: '/desktop/', component: Device, name: 'Desktop' },
    { path: '/local', component: Bus, name: 'Local' },
    { path: '/auth/', component: Auth, name: 'Auth' },
    { path: '/staking/', component: Stake, name: 'Stake' },
    { path: '/createEOSAccount/', component: CreateEOSAccount, name: 'CreateEOSAccount' },
    { path: '/changeaccount/:requestId', component: ChangeAccount, name: 'ChangeAccount' },
    { path: '/cloudBoid', component: CloudBoid, name: 'CloudBoid' },
    { path: '/donate', component: SeasonPass, name: 'SeasonPass' },
    { path: '/drawing', component: SeasonPass, name: 'SeasonPass' },
    { path: '/vote/', component: vote, name: 'Vote' },
    { path: '*', component: Index }
  ]
})
