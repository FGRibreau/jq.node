'use strict'

const { execute } = require('./core')

const { argv, showHelp } = require('yargs')
.wrap(null) //  specify no column limit (no right-align)
.usage('Usage: $0 <command> [options]')
.help('h')
.alias('h', 'help')
.version()
.alias('v', 'version')

.boolean('raw-input')
.alias('x', 'raw-input')
.describe('raw-input', 'Read input as a string')

.boolean('json')
.alias('j', 'json')
.describe('json', 'Force JSON output')

.boolean('color')
.alias('C', 'color')
.describe('color', 'Colorize JSON (--color=true to enable it)')
.default('color', false)

.describe('require', 'require the given module')
.alias('r', 'require');

if (process.stdin.isTTY) {
  showHelp();
  process.exit(0);
}

const options = Object.assign({}, argv, { transform: argv._[0] })
execute(process.stdin.resume(), options, (err, result) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }

  console.log(result);
})
