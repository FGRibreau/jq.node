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
  _.$$input$$ = args.rawInput ? content : JSON.parse(content);
  const scriptStrWithPipes = args._[0];
  const scriptStr = (!scriptStrWithPipes || scriptStrWithPipes === '.'
    ? 'identity'
    : scriptStrWithPipes).replace(/ \| /g, ',');
  const source = `flow(${scriptStr})($$input$$);`;
  const script = new vm.Script(source);
  const context = new vm.createContext(sandbox);
  let result;
  try{
    result = script.runInContext(context);
  } catch(err){
    console.error('[Invalid Expression] %s', source);
    console.error(err);
    process.exit(1);
  }
  const output = args.json || !_.isString(result)
    ? JSON.stringify(result, null, 2)
    : result;
  console.log(output);
});
