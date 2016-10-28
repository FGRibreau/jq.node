const argv = require('yargs')
.wrap(null) //  specify no column limit (no right-align)
.count('Usage: $0 <command> [options]');

module.exports = argv.args;
