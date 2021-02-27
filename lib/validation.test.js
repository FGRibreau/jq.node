'use strict'

const t = require('chai').assert;
const { validate } = require('./validation')

describe('validation', () => {
  describe('optional', () => {
    const fullConfig = {
      globals: {},
      rawInput: true,
      json: true,
      color: true,
      require: ['module-a']
    }

    const options = Object.keys(fullConfig)

    options.forEach(option => {
      it(`${option} is optional`, () => {
        const modified = Object.assign({}, fullConfig)
        delete modified[option]
        t.doesNotThrow(() => {
          validate(modified)
        })
      })
    })
  })

  describe('require', () => {
    it('valid with a single module', () => {
      t.doesNotThrow(() => {
        validate({ require: 'some-module' })
      })
    })

    it('valid with an array of modules', () => {
      t.doesNotThrow(() => {
        validate({ require: ['some-module', 'some-other-module'] })
      })
    })
  })
});
