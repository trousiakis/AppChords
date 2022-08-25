const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const { songSchema } = require('./schemas.js');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Song = require('./models/song');
const song = require('./models/song');
const uri =
  'mongodb+srv://tgenuz:tgenuzpass@cluster0.aywd0gi.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use('/styles', express.static(__dirname + '/styles'));
app.use(methodOverride('_method'));

const validateSong = (req, res, next) => {
  const { error } = songSchema.validate(req.body);
  if (error) {
    const msg = eror.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  res.render('home');
});

app.get(
  '/songs',
  catchAsync(async (req, res) => {
    const songs = await Song.find({});
    res.render('songs/index', { songs });
  })
);

app.get('/songs/new', (req, res) => {
  res.render('songs/new');
});

app.post(
  '/songs',
  validateSong,
  catchAsync(async (req, res, next) => {
    const song = new Song(req.body.song);
    await song.save();
    res.redirect(`/songs/${song._id}`);
  })
);

app.get(
  '/songs/:id',
  catchAsync(async (req, res) => {
    const song = await Song.findById(req.params.id);
    res.render('songs/show', { song });
  })
);

app.get(
  '/songs/:id/edit',
  catchAsync(async (req, res) => {
    const song = await Song.findById(req.params.id);
    res.render('songs/edit', { song });
  })
);

app.put(
  '/songs/:id',
  validateSong,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const song = await Song.findByIdAndUpdate(id, { ...req.body.song });
    res.redirect(`/songs/${song._id}`);
  })
);
app.delete(
  '/songs/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await song.findByIdAndDelete(id);
    res.redirect('/songs');
  })
);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(8080, () => {
  console.log('Serving on port 8080');
});
