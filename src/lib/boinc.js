var boinc = {
  parsePrefs(prefs){
    for (var key in prefs) {
      if (prefs.hasOwnProperty(key)) {
        prefs[key] = parseFloat(prefs[key])
        if (key === 'run_on_batteries' || key === 'run_if_user_active'){
          if (prefs[key] === 1) prefs[key] = true
          else prefs[key] = false
        }
      }
    }
    return prefs
  },
  convertForPrefs(prefs){
    for (var key in prefs) {
      if (prefs.hasOwnProperty(key)) {
        if (key === 'run_on_batteries' || key === 'run_if_user_active'){
          if (prefs[key] === true) prefs[key] = 1
          else prefs[key] = 0
        }
      }
    }
    return prefs
  },
  parseLog(data){
    var parsedText = data
    var textArray
    try {
    textArray = data.replace(/\[.*?\]/g,'').split(/(\r\n|\n|\r)/gm)
    textArray = textArray.map((el)=>{
    if(el === "\n" || el === "") return el
    else return el.slice(20)
    })
    parsedText = textArray.join('')
    return parsedText
    } catch (error) {
    console.error(error)
    }
  },
  checkPaused(val){
    if (val.search('Suspending computation - computer is in use') > -1 ) return 'Paused: User Activity Detected'
    if (val.search('Suspending computation - on batteries') > -1 ) return 'Paused: Device on Batteries'
    return false
  },
  checkResumed(val){
    if (val.search('Resuming computation') > -1 ) return true
    if (val.search('Resuming network activity') > -1 ) return true
    return false
  },
  config:{defaultConfig:{autoStart:true}}
}
module.exports = boinc
// export boinc