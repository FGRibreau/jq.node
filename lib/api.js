'use strict'

const Joi = require('joi')
const { Readable } = require('stream')
const { execute } = require('./core')

function validate (options, transform) {
  const out = Joi.attempt(options, {
    'raw-input': Joi.boolean().optional(),
    json: Joi.boolean().optional(),
    color: Joi.boolean().optional(),
    require: Joi.array().single().items(
      Joi.boolean()
    ).optional()
  })

  out.transform = transform
  return out
}

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
  const stream = makeStream(input)
  const options = validate(rawOptions, transform)
  return execute(stream, options, cb)
}
