var filenames = {
  '0.10': 'es-features-node-0.10.json',
  '0.11': 'es-features-node-0.11.json',
  '0.12': 'es-features-node-0.12.json',
  '4': 'es-features-node-4.json',
  '5': 'es-features-node-5.json'
}

var join = require('path').join
var inThisFolder = join.bind(null, __dirname, '/')
var load = require('fs').readFileSync

function getFeaturesFor (version) {
  var filename = filenames[version]
  if (!filename) {
    console.error('Cannot ES6 features for Node', version)
    console.error('Using features for Node 0.12')
    filename = filenames['0.12']
  }

  return JSON.parse(load(inThisFolder(filename)))
}

function getFeatures (version) {
  if (!version) {
    var all = {}
    Object.keys(filenames).forEach(function (ver) {
      all[ver] = getFeaturesFor(ver)
    })
    return all
  }

  return getFeaturesFor(version)
}

module.exports = getFeatures

if (!module.parent) {
  console.log('features for Node 4')
  console.log(getFeatures('4'))
  console.log('features for all known versions')
  console.log(getFeatures())
}
