var la = require('lazy-ass')
var is = require('check-more-types')
var compiled = require('compiled')
la(is.fn(compiled.build), 'missing build', compiled)

var packageFilename = './package.json'
var fs = require('fs')
var pkg = JSON.parse(fs.readFileSync(packageFilename))
var config = pkg.config && pkg.config['pre-compiled']
la(is.object(config),
  'missing pre-compiled config in package file', packageFilename)

var nodeFeatures = require('./features/get-features')()
la(is.object(nodeFeatures), 'could not load node features')

compiled.build(config)
  .then(function () {
    var versions = is.array(config.versions) && config.versions ||
      is.array(config.node) && config.node
    if (is.not.array(versions)) {
      versions = Object.keys(nodeFeatures)
    }
    console.log('compiling for node versions', versions)
    var start = Promise.resolve(true)
    versions.forEach(function (version) {
      var features = nodeFeatures[version]
      if (!is.object(features)) {
        console.error('Unknown node version', version)
        console.error('Available versions', Object.keys(nodeFeatures))
        return
      }

      function compileForVersion () {
        console.log('compiling for version', version)
        return compiled.compile(config)
      }

      start = start.then(compileForVersion)
    })
    return start
  })
  .catch(function (error) {
    console.error(error)
    process.exit(-1)
  })
