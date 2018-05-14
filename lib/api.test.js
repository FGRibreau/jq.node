'use strict';

const t = require('chai').assert;
const { jq } = require('./api')

describe('api', () => {
  describe('jq', () => {
    it('should transform data', done => {
        jq('20111031', 'thru(a => moment.utc(a, "YYYYMMDD"))', { rawInput: true, require: 'moment' }, function (err, result) {
          t.strictEqual(result, '"2011-10-31T00:00:00.000Z"')
          done(err)
        })
    });
  });
});
