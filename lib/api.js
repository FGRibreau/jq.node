'use strict'

const { validate } = require('./validation')
const { Readable } = require('stream')
const { execute } = require('./core')

function isStream (input) {
  return typeof input.on === 'function'
}

function makeStream (input) {
  if (isStream(input)) { return input }

  const stream = new Readable();
  stream._read = function noop() {};
  stream.push(input);
  stream.push(null);
  return stream;
}

exports.jq = function (input, transform, rawOptions, cb) {
  const options = validate(rawOptions, transform)
  // disable cli-oriented detection (see FGRibreau/jq.node#47)
  if (!('color' in options)) options.color = false;
  const stream = makeStream(input)
  return execute(stream, options, cb)
}
