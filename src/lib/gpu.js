const nvidia = require('./nvidiaDB.json')
const amd = require('./amdDB.json')

  function parseDB(db,query) {
  for (var family of Object.keys(db)) {
    const classes = Object.keys(db[family])
    for (var gpuClass of classes) {
      const list = db[family][gpuClass]
      if (list.some(el => el === query)) return {family,gpuClass}
    }
  }
}

function findGPU(query){
  const findNvidia = parseDB(nvidia,query)
  if (findNvidia){
    findNvidia.type = "Nvidia"
    return findNvidia
  }else {
    const findAMD = parseDB(amd, query)
    if (findAMD){
      findAMD.type = "AMD"
      return findAMD
    }
  }
}

var gpu = {
  info:null,
  trex:{
    defaultPool:"stratum+tcp://rvn.boid.com:3636",
    defaultConfig: {
      pools: [],
      "api-bind-http": "0.0.0.0:4067",
      "json-response": true,
      "algo": "x16r",
      "intensity": 18,
      "autoupdate": false
    },
    config:{
      init(deviceId){
        return Object.assign(gpu.trex.defaultConfig, { pools: [{ url:gpu.trex.defaultPool, user:"RHoQhptpZRHdL2he2FEEXwW1wrxmYJsYsC.cjv74fygjupf109942wo0j9qf"}]})
      },
      updateIntensity(existingConfig,intensity){
        return Object.assign(existingConfig,{intensity})
      }
    }
  },
  parse(gpuData){
    console.log('got GPU Data', gpuData)
    var gpus = []
    for (var gpu of gpuData){
      const gpuID = gpu.id.split('0x')[1].toLowerCase()
      console.log(gpuID)
      const parsedGPU = findGPU(gpuID)
      if (parsedGPU) {
        gpus.push(parsedGPU)
      }
    }
    return gpus
  }
}

if (process.argv[2] === 'dev') console.log(findGPU('13c2'))

module.exports = gpu