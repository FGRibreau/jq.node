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
  const scriptStrWithPipes = process.argv.slice(2)[0];
  const scriptStr = (!scriptStrWithPipes || scriptStrWithPipes === '.'
    ? 'identity'
    : scriptStrWithPipes).replace(/\)\s*\|/g, '),');
  const source = `flow(${scriptStr})($$input$$);`;
  const script = new vm.Script(source);
  const context = new vm.createContext(sandbox);
  const result = script.runInContext(context);
  console.log(_.isString(result)
    ? result
    : JSON.stringify(result, null, 2));
});
