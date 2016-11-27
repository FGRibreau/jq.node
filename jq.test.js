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

describe('jq', () => {
  describe('colorize', () => {
    it('should handle colorize piping', () => {
      t.strictEqual(run(`echo '{}' | ./jq | ./jq`), "\u001b[33m{\u001b[39m\u001b[33m}\u001b[39m\n");
    });

    it('should handle monochrome option', () => {
      t.strictEqual(run(`echo '{}' | ./jq --color=false`), "{}\n");
    });

    it('should handle undefined output', () => {
      t.strictEqual(run(`echo '{}' | ./jq 'console.log'`), "{}\n\n");
    });
  });

  describe('require', () => {
    it('should handle not found npm modules', () => {
      t.strictEqual(run(`echo '{}' | ./jq --color=false -r will-never-exist-${+new Date()} ''`), '{}\n');
    });

    it('should expose a valid npm module inside the expression', () => {
      t.strictEqual(run(`echo '20111031' | ./jq -x -r moment --color=false 'thru(a => moment.utc(a, "YYYYMMDD"))'`), '"2011-10-31T00:00:00.000Z"\n');
    });
  });
});
