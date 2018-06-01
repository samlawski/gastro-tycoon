module.exports = (() => {
  const speechAssets = {
    'en-US': require('./assets/speech/en-US.json')
  }
  const availableLocales = Object.keys(speechAssets)
  const insertParams = (string, params) => {
    return Object.keys(params).reduce((acc, key) => {
      return acc.replace(`%${key}`, params[key])
    }, string)
  }

  function say(key, params = {}, groupKey = say.prototype.action) {
    let returnObj = speechAssets[say.prototype.locale][groupKey][key]
    // doc: assign params to either string or all strings in an array: 
    if(Object.keys(params).length > 0){
      returnObj = (typeof returnObj == 'string') ?
        insertParams(returnObj, params) :
        returnObj.forEach(obj => insertParams(obj, params))
    }
    return returnObj
  }
  say.prototype.locale = 'en-US' // doc: set en-US as default

  return {
    insertParams,
    say,
    availableLocales
  }
})()
