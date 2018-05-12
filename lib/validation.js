
const Joi = require('joi')

exports.validate = function (options, transform) {
  const out = Joi.attempt(options, Joi.object({
    rawInput: Joi.boolean().optional(),
    json: Joi.boolean().optional(),
    color: Joi.boolean().optional(),
    require: Joi.array().single().items(
      Joi.string()
    ).optional()
  }).label('options'))

  out.transform = transform
  return out
}