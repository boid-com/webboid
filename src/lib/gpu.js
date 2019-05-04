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
  parse(gpuData){
    var gpuID = (gpuData[0].DisplayDevice[0].DeviceID[0])
    console.log('got GPU NAME', gpuID)
    gpuID = gpuID.split('0x')[1].toLowerCase()
    console.log(gpuID)
    gpu.info = findGPU(gpuID)
    if (gpu.info) {
      console.log(gpu.info)
      return gpu.info
    } else return null
  }
}

if (process.argv[2] === 'dev') console.log(findGPU('13c2'))

module.exports = gpu