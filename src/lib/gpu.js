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
  config:{
    defaultConfig:{
      rememberLast:true,
      autoStart:false,
      pauseOnActivity:false,
      resumeTimeout:120000
    }
  },
  trex: {
    defaultPool: "stratum+tcp://boid.x16rv2.jamiec.org:3637",
    defaultConfig: {
      pools: [],
      "api-bind-http": "0.0.0.0:4067",
      "json-response": true,
      "algo": "x16rv2",
      "intensity": 15,           
      "autoupdate": false
    },
    config: {
      init( deviceId ) {
        return Object.assign( gpu.trex.defaultConfig, { pools: [ { url: gpu.trex.defaultPool, user: "RCanGsBnSEH8dnyNvFyUTyfXChu6M9DaXK." + deviceId } ] } )
      }
    }
  },
  wildrig:{
    defaultConfig:[ 
      '--algo=x16rv2',
      '--opencl-threads=2',
      '--opencl-launch=14x0',
      '--donate-level=1',
      '--url=stratum+tcp://boid.x16rv2.jamiec.org:3637',
      '--watchdog','--api-port=4068',
    ],
    config:{
      init(deviceId){
        var config = gpu.wildrig.defaultConfig
        config.unshift('--pass=' + deviceId)
        config.unshift('--user=RHoQhptpZRHdL2he2FEEXwW1wrxmYJsYsC.'+ deviceId)
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
    if (!gpuData) return false
    var gpus = []
    for ( var gpu of gpuData ) {
      const gpuID = gpu.id.split( '0x' )[ 1 ].toLowerCase()
      console.log( gpuID )
      var parsedGPU = findGPU( gpuID )
      if ( parsedGPU ) parsedGPU.valid = true, parsedGPU.name = gpu.name
      else parsedGPU = gpu, parsedGPU.valid = false
      gpus.push( parsedGPU )
    }
    return gpus
  }
}

if ( process.argv[ 2 ] === 'dev' ) console.log( findGPU( '13c2' ) )

module.exports = gpu