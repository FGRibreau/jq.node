'use strict'

const {execute} = require('./core')

const yargs = require('yargs/yargs')(process.argv.slice(2));

const {hideBin} = require('yargs/helpers');
const argv = yargs.usage('Usage: $0 <command> [options]')
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

    .describe('require', 'require the given module')
    .alias('r', 'require')
    .argv;


if (process.stdin.isTTY) {
    yargs.showHelp();
    //showHelp();
    //process.exit(0);

    return;
}

const options = Object.assign({}, argv, {transform: argv._[0]})
execute(process.stdin, options, (err, result) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    console.log(result);
})
