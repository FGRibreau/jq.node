'use strict';

const vm = require('vm');
const _ = require('lodash/fp');
const cardinal = require('cardinal');
const stripAnsi = require('strip-ansi');
require('./mixins')(_);

const deps = {};

exports.execute = function (stream, options, cb) {
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

  stream.on('data', function (buf) {
    const chunk = Buffer.from(buf)
    chunks.push(chunk)
    length += chunk.length
  }).on('end', function () {
    const content = stripAnsi(Buffer.concat([...chunks], length))
    const sandbox = Object.assign({}, _, options.globals, {
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
