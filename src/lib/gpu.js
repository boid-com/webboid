const nvidia = require( './nvidiaDB.json' )
const amd = require( './amdDB.json' )

function parseDB( db, query ) {
  for ( var family of Object.keys( db ) ) {
    const classes = Object.keys( db[ family ] )
    for ( var gpuClass of classes ) {
      const list = db[ family ][ gpuClass ]
      if ( list.some( el => el === query ) ) return { family, gpuClass }
    }
  }
}

function findGPU( query ) {
  const findNvidia = parseDB( nvidia, query )
  if ( findNvidia ) {
    findNvidia.type = "Nvidia"
    return findNvidia
  } else {
    const findAMD = parseDB( amd, query )
    if ( findAMD ) {
      findAMD.type = "AMD"
      return findAMD
    }
  }
}

var gpu = {
  info: null,
  trex: {
    defaultPool: "stratum+tcp://rvn.boid.com:3636",
    defaultConfig: {
      pools: [],
      "api-bind-http": "0.0.0.0:4067",
      "json-response": true,
      "algo": "x16r",
      "intensity": 20,
      "autoupdate": false
    },
    config: {
      init( deviceId ) {
        return Object.assign( gpu.trex.defaultConfig, { pools: [ { url: gpu.trex.defaultPool, user: "RHoQhptpZRHdL2he2FEEXwW1wrxmYJsYsC." + deviceId } ] } )
      }
    }
  },
  wildrig:{
    defaultConfig:[ 
      '--algo=x16r',
      '--opencl-threads=2',
      '--opencl-launch=15x0',
      '--url=stratum+tcp://rvn.boid.com:3636',
      '--watchdog','--api-port=4068'
    ],
    config:{
      init(deviceId){
        var config = gpu.wildrig.defaultConfig
        config.push('--user=RHoQhptpZRHdL2he2FEEXwW1wrxmYJsYsC.' + deviceId)
        return config
      },
      parse(configArray){
        var config = {}
        configArray.forEach(el => {
          el = el.split('=')
          el[0] = el[0].replace('--','')
          config[el[0]] = el[1] || true
          if (el[0] === 'opencl-launch')  config.intensity = parseFloat(el[1])
        })
        console.log(config)
        return config
      }
    },
  },
  parse( gpuData ) {
    console.log( 'got GPU Data', gpuData )
    var gpus = []
    for ( var gpu of gpuData ) {
      const gpuID = gpu.id.split( '0x' )[ 1 ].toLowerCase()
      console.log( gpuID )
      var parsedGPU = findGPU( gpuID )
      if ( parsedGPU ) parsedGPU.valid = true, parsedGPU.name = gpu.name
      else parsedGPU = gpu
      gpus.push( parsedGPU )
    }
    return gpus
  }
}

if ( process.argv[ 2 ] === 'dev' ) console.log( findGPU( '13c2' ) )

module.exports = gpu