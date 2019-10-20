import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  mode: 'history',
  scrollBehavior: (to,from) => {
    if (to.path === from.path) return
    else return { y: 0 }
  },

  routes: [
    { path: '/', component: load('Index'), name: 'Index' },
    { path: '/confirmPayoutAccount/:requestId/:accountName', component: load('Index'), name:'confirmPayoutAccount'},
    { path: '/u/:username?', component: load('User'), name: 'User' },
    { path: '/t/:teamname?', component: load('Team'), name: 'Team' },
    { path: '/datatable/', component: load('workUnitsDev'), name: 'workUnitsDev' },
    { path: '/testdevice/:deviceId?', component: load('deviceTest'), name: 'deviceTest' },
    { path: '/leaderboards/', component: load('Leaderboards'), name: 'Leaderboards' },
    { path: '/device/', component: load('Device'), name: 'Device' },
    { path: '/desktop2/', component: load('Device2'), name: 'Device2' },
    { path: '/desktop/', component: load('Device'), name: 'Desktop' },
    { path: '/local', component: load('Bus'), name: 'Local' },
    { path: '/auth/', component: load('Auth'), name: 'Auth' },
    { path: '/staking/', component: load('Stake'), name: 'Stake' },
    { path: '/createEOSAccount/', component: load('CreateEOSAccount'), name: 'CreateEOSAccount' },
    { path: '/changeaccount/:requestId', component: load('ChangeAccount'), name: 'ChangeAccount' },
    { path: '/cloudBoid', component: load('CloudBoid'), name: 'CloudBoid' },
    // { path: '/tx/:requestId', component: load('ChangeAccount'), name: 'ChangeAccount' },
    { path: '/vote/', component: load('vote'), name: 'Vote' },
    { path: '*', component: load('Index') }
  ]
})
