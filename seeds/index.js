const mongoose = require('mongoose');
const Song = require('../models/song');
const {
  places,
  descriptors,
  names,
  lastNames,
  toneKeys,
  tunings,
} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/app-chords', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const dummyLyrics =
  'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.';
const seedDB = async () => {
  await Song.deleteMany({});
  for (let i = 0; i < 50; i++) {
    let fullNameMusic = `${sample(names)} ${sample(lastNames)}`;
    let fullNameLyrics = `${sample(names)} ${sample(lastNames)}`;
    const s = new Song({
      title: `${sample(descriptors)} ${sample(places)}`,
      lyrics: `${dummyLyrics}`,
      composer: `${fullNameMusic}`,
      lyricist: `${fullNameLyrics}`,
      toneKey: `${sample(toneKeys)}`,
      tuning: `${sample(tunings)}`,
    });

    await s.save();
  }
};

seedDB();
