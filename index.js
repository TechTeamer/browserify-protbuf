const through = require('through2')
const pbjs = require('protobufjs/cli/pbjs')

const DEFAULT_EXT_REGEX = /\.proto$/

let extRegex

function compile (filePath, callback) {
  pbjs.main(['-t', 'json-module', filePath], (err, output) => {
    if (err) {
      callback(err)
    }

    // Use a new protobuf Root for each .proto file
    output = output.replace(
      'var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))',
      'var $root = new $protobuf.Root()'
    )

    callback(null, output)
  })
}

function protify (filePath, options) {
  const {
    ext = DEFAULT_EXT_REGEX
  } = options

  if (ext instanceof RegExp) {
    extRegex = ext
  } else if (typeof ext === 'string') {
    extRegex = new RegExp(ext)
  } else {
    throw new Error('Invalid config: "ext" must be an instance of RegExp or a string!')
  }

  if (!extRegex.test(filePath)) {
    return through()
  }

  function push (chunk, _, next) {
    next()
  }

  function end (next) {
    compile(filePath, (err, compiled) => {
      if (err) {
        throw err
      }

      this.push(compiled)
      next()
    })
  }

  return through(push, end)
}

module.exports = protify
module.exports.compile = compile
