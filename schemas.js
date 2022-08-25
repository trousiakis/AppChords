const Joi = require('joi');

module.exports.songSchema = Joi.object({
  song: Joi.object({
    title: Joi.string().required(),
    lyrics: Joi.string().required(),
    composer: Joi.string().required(),
    lyricist: Joi.string().required(),
    toneKey: Joi.string().required(),
    tuning: Joi.string().required(),
  }).required(),
});
