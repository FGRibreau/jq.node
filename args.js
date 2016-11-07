const argv = require('yargs')
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
.describe('color', 'Colorize JSON (--color=false to disable it)')
.default('color', true);

module.exports = {
  args: argv.argv,
  showHelp: argv.showHelp
}
