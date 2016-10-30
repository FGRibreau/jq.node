'use strict';

let content = '';
const vm = require('vm');
const args = require('./args');
const _ = require('lodash/fp');
require('./mixins')(_);

process.stdin.resume().on('data', function(buf) {
  content += buf.toString();
}).on('end', function() {
  const sandbox = _;
  _.$$input$$ = JSON.parse(content);
  const scriptStrWithPipes = args._[0];
  const scriptStr = (!scriptStrWithPipes || scriptStrWithPipes === '.'
    ? 'identity'
    : scriptStrWithPipes).replace(/\)\s*\|/g, '),');
  const source = `flow(${scriptStr})($$input$$);`;
  const script = new vm.Script(source);
  const context = new vm.createContext(sandbox);
  const result = script.runInContext(context);
  const output = args.json || !_.isString(result)
    ? JSON.stringify(result, null, 2)
    : result;
  console.log(output);
});
