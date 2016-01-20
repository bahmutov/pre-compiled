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

compiled.build(config)
  .catch(function (error) {
    console.error(error)
    process.exit(-1)
  })
