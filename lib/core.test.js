'use strict';

const t = require('chai').assert;
const { Readable } = require('stream')
const { execute } = require('./core')

function makeStream (input) {
  const stream = new Readable();
  stream._read = function noop() {};
  stream.push(input);
  stream.push(null);
  return stream;
}

describe('jq', () => {
  describe('colorize', () => {
    it('should handle colorize piping', done => {
      const stream = makeStream('{}')
      execute(stream, { color: true }, (err, result) => {
        t.strictEqual(result, "\u001b[33m{\u001b[39m\u001b[33m}\u001b[39m\n");
        done(err)
      })
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

    it('should expose a valid npm module inside the expression', () => {
      t.strictEqual(run(`echo '- a: OK' | ./jq -x -r js-yaml --color=false 'jsYaml.safeLoad | JSON.stringify'`), '[{"a":"OK"}]\n');
    });
  });
});
