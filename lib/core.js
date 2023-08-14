'use strict';

const vm = require('vm');
const _ = require('lodash/fp');
const cardinal = require('cardinal');
const stripAnsi = require('strip-ansi');
const supportsColor = import('supports-color');
require('./mixins')(_);

const deps = {};

exports.shouldColorize = function (cb) {
  // https://github.com/chalk/supports-color#usage
  return supportsColor.then(sc => cb(!!sc.default.stdout));
}

exports.execute = function (stream, options, cb) {
  if ('color' in options) {
    doExecute(stream, options, cb);
  } else exports.shouldColorize(color => {
    options.color = color;
    doExecute(stream, options, cb);
  });
}

function doExecute(stream, options, cb) {
  const highlight = options.color
    ? cardinal.highlight
    : _.identity;

  if (options.require) {
    const lazyRequire = require('lazy-require');
    const TMP = require('os').tmpdir();
    _.castArray(options.require).reduce((deps, dep) => {
      deps[_.camelCase(dep)] = lazyRequire(dep, {
        cwd: TMP,
        save: false
      })
      return deps;
    }, deps);
  }

  const chunks = []
  let length = 0
  
  stream.resume().on('data', function (buf) {
    const chunk = Buffer.from(buf)
    chunks.push(chunk)
    length += chunk.length
  }).on('end', function () {
    const content = stripAnsi(Buffer.concat([...chunks], length))
    const sandbox = Object.assign({}, _, {
      console: console,
      exit: process.exit.bind(process), // todo: understand this!
      $$input$$: options.rawInput ? content : JSON.parse(content)
    }, deps);
    const scriptStrWithPipes = options.transform;
    const scriptStr = (!scriptStrWithPipes || scriptStrWithPipes === '.'
      ? 'identity'
      : scriptStrWithPipes).replace(/ \| /g, ',');
    const source = `flow(${scriptStr})($$input$$);`;
    var result;
    var shouldHighlight;
    try {
      const script = new vm.Script(source);
      const context = new vm.createContext(sandbox);

      result = script.runInContext(context);
      shouldHighlight = options.json || !_.isString(result) 
    } catch (err) {
      return cb(new Error(`[Invalid Expression] %s ${source}\nCaused by ${err}`));
    }

    return cb(null, shouldHighlight
    ? highlight(JSON.stringify(result, null, 2) || '')
    : result);
  });
}
