'use strict'

var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn

var lightpost = function(file, cb) {
  var child = spawn(__dirname + '/../src/cli.js', [file])

  var buf = ''
  var errBuf = ''

  child.stdout.on('data', function(data) {
    buf += data.toString()
  })

  child.stderr.on('data', function(data) {
    errBuf += data
  })

  var counter = 2
  var tryEnd

  child.stdout.on('end', function() {
    counter--
    tryEnd()
  })

  child.stderr.on('end', function() {
    counter--
    tryEnd()
  })

  tryEnd = function() {
    if (counter !== 0) {
      return
    }

    cb(errBuf || null, buf)
  }
}

var getDirectories = function(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory()
  })
}

var tests = getDirectories(__dirname)
var testsCompleted = 0
var errors = 0

var tryFinish

tests.forEach(function(test) {
  lightpost(__dirname + '/' + test + '/input.lp', function(err, output) {
    var expectedOutput = fs.readFileSync(__dirname + '/' + test + '/output.txt').toString()

    if (err) {
      errors++
      console.error(err)
    } else if (output !== expectedOutput) {
      errors++
      console.error(test, 'failed:', JSON.stringify(output), '!==', JSON.stringify(expectedOutput))
    }

    testsCompleted++
    tryFinish()
  })
})

tryFinish = function() {
  if (testsCompleted !== tests.length) {
    return
  }

  console.log('Completed ' + testsCompleted + ' tests with ' + errors + ' error(s)')

  process.exit(errors === 0 ? 0 : 1)
}
