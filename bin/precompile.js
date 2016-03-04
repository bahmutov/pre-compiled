#!/usr/bin/env node

'use strict'

var la = require('lazy-ass')
var is = require('check-more-types')
var path = require('path')
var fs = require('fs')

var compiled = require('compiled')
la(is.fn(compiled.build), 'missing build', compiled)

var packageFilename = path.join(process.cwd(), './package.json')
var pkg = JSON.parse(fs.readFileSync(packageFilename))
var config = pkg.config && pkg.config['pre-compiled']
la(is.object(config),
  'missing pre-compiled config in package file', packageFilename)

// convert a string "files" value to an array
if (is.string(config.files)) {
  config.files = [config.files]
}

// choose "dist" as default output directory
if (is.not.unemptyString(config.dir)) {
  config.dir = 'dist'
}

la(is.all(config, {dir: is.unemptyString, files: is.array}),
  'invalid compiled config', config)

var nodeFeatures = require('../features/get-features')()
la(is.object(nodeFeatures), 'could not load node features')

// assuming pre-compiled module will do the bundle copy on the client side
config.moduleWithBabelPolyfill = 'pick-precompiled'

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

        la(is.object(features), 'expected object with features, version', version)
        config.esFeatures = features

        config.formOutputFilename = function formOutputFilename (bundleName) {
          la(is.unemptyString(bundleName), 'expected bundle name')
          var dir = is.unemptyString(config.dir) ? config.dir : 'dist'
          var filename = path.join(dir, bundleName + '.compiled.for.' + version + '.js')
          return filename
        }

        la(is.fn(compiled.compile), 'not a function (compile)')
        return compiled.compile(config)
      }

      start = start.then(compileForVersion)
    })
    return start
  })
  .catch(function (error) {
    console.error(error)
    console.error(error.stack)
    process.exit(-1)
  })
