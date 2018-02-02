// ---------- generated ----------
// azure-chaos-fn generated this file for you
// it's pretty unlikely you'll need to change it
// 
// you are probably looking for 'chaos.js'
// -------------------------------
const azureChaosFn = require('azure-chaos-fn/v1')
const chaos = require('./chaos')

module.exports.start = (context) => {
    // starts chaos
    return azureChaosFn.start.bootStrap(context, chaos.start)
}

module.exports.stop = (context) => {
    // stops chaos
    return azureChaosFn.stop.bootStrap(context, chaos.stop)
}