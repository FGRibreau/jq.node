'use strict'

module.exports = (_) => {
  _.csv = (data) => {
    const json2csv = require('json2csv');
    const fields = _.flow(_.take(10), _.map(_.keys), _.flatten, _.uniq)(data);
    return json2csv(_.extend({}, {
      data: data,
      fields: fields // dummy implementation (todo: support for multi-level nesting, handle sparse objects)
    }));
  };

  return _;
};
