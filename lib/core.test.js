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

describe('core', () => {
  describe('colorize', () => {
    it('should handle colorize piping', done => {
      const stream = makeStream('{}')
      execute(stream, { color: true }, (err, result) => {
        t.strictEqual(result, "\u001b[33m{\u001b[39m\u001b[33m}\u001b[39m");
        done(err)
      })
    });

    it('should handle monochrome option', done => {
      const stream = makeStream('{}')
      execute(stream, { color: false }, (err, result) => {
        t.strictEqual(result, '{}');
        done(err)
      })
    });

    it('monochrome by default', done => {
      const stream = makeStream('{}')
      execute(stream, {}, (err, result) => {
        t.strictEqual(result, '{}');
        done(err)
      })
    });

    it('should handle undefined output', done => {
      const stream = makeStream('{}')
      execute(stream, { transform: 'console.log' }, (err, result) => {
        t.strictEqual(result, '');
        done(err)
      })
    });
  });

  describe('require', () => {
    it('should handle not found npm modules', done => {
      const stream = makeStream('{}')
      const nonexistentModule = `will-never-exist-${+new Date()}`
      execute(stream, { require: [nonexistentModule] }, (err, result) => {
        t.strictEqual(result, '{}');
        done(err)
      })
    });

    const scenarios = [
      { modules: ['moment'], transform: 'thru(a => moment.utc(a, "YYYYMMDD"))', stream: makeStream('20111031'), output: '"2011-10-31T00:00:00.000Z"' },
      { modules: ['js-yaml'], transform: 'jsYaml.safeLoad | JSON.stringify', stream: makeStream('- a: OK'), output: '[{"a":"OK"}]' },
    ]

    scenarios.forEach(({ modules, transform, stream, output }) => {
      it(`should expose a valid npm module inside the expression (${module})`, done => {
        const options = {
          require: modules,
          transform,
          rawInput: true
        }
        execute(stream, options, (err, result) => {
          t.strictEqual(result, output);
          done(err)
        })
      });
    })
  });
});
