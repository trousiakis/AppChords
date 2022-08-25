const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  title: String,
  lyrics: String,
  composer: String,
  lyricist: String,
  toneKey: String,
  tuning: String,
});

module.exports = mongoose.model('Song', SongSchema);
