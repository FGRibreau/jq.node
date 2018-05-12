'use strict';

const execSync = require('child_process').execSync;
const debug = (res, debug) => {
  if(debug){
    console.log(JSON.stringify(res));
  }
  return res;
};

const run = (cmd) => debug(execSync(cmd).toString('utf8'));
const t = require('chai').assert;

describe('cli', () => {
  it('should transform data', () => {
    t.strictEqual(
      run(
        `echo '20111031' | node ./lib/cli.js -x -r moment --color=false 'thru(a => moment.utc(a, "YYYYMMDD"))'`
      ), '"2011-10-31T00:00:00.000Z"\n');
  });
});
