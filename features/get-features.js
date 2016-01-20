var filenames = {
  '0.11': 'es-features-node-0.11.json',
  '0.12': 'es-features-node-0.12.json',
  '4': 'es-features-node-4.json',
  '5': 'es-features-node-5.json'
}

var join = require('path').join
var inThisFolder = join.bind(null, __dirname, '/')
var load = require('fs').readFileSync

function getFeatures (version) {
  var filename = filenames[version]
  if (!filename) {
    console.error('Cannot ES6 features for Node', version)
    console.error('Using features for Node 0.12')
    filename = filenames['0.12']
  }

  return JSON.parse(load(inThisFolder(filename)))
}

module.exports = getFeatures

if (!module.parent) {
  console.log('features for Node 4')
  console.log(getFeatures('4'))
}
