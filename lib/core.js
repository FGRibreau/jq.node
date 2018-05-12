'use strict';

let content = '';
const vm = require('vm');
const _ = require('lodash/fp');
const cardinal = require('cardinal');
const stripAnsi = require('strip-ansi');
require('./mixins')(_);

const deps = {};

exports.execute = function (stream, options) {
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
  
  stream.on('data', function(buf) {
    content += buf.toString();
  }).on('end', function() {
    const sandbox = Object.assign({}, _, {
      console: console,
      exit: process.exit.bind(process), // todo: understand this!
      $$input$$: options.rawInput ? stripAnsi(content) : JSON.parse(stripAnsi(content))
    }, deps);
    const scriptStrWithPipes = options._[0];
    const scriptStr = (!scriptStrWithPipes || scriptStrWithPipes === '.'
      ? 'identity'
      : scriptStrWithPipes).replace(/ \| /g, ',');
    const source = `flow(${scriptStr})($$input$$);`;
    const script = new vm.Script(source);
    const context = new vm.createContext(sandbox);
    let result;
    try {
      result = script.runInContext(context);
    } catch (err) {
      throw new Error(`[Invalid Expression] %s ${source}`);
    }
    const output = options.json || !_.isString(result)
      ? highlight(JSON.stringify(result, null, 2) || '')
      : result;
  });
}