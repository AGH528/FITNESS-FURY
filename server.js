require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const User = require('./models/user');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());


app.use(express.static('public'));


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'Rock_My_Socks',
    resave: false,
    saveUninitialized: false,
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


app.set('view engine', 'ejs');
app.set('views', './views');


const challengesRouter = require('./routes/challenges');
app.use('/challenges', challengesRouter);


app.get('/', (req, res) => res.redirect('/challenges'));


app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error_msg', 'User already exists');
      return res.redirect('/register');
    }
    const user = new User({ username, password });
    await user.save();
    req.flash('success_msg', 'Registered successfully. Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Failed to register');
  }
});


app.get('/login', (req, res) => res.render('login', { message: req.flash('error_msg') }));
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/challenges',
    failureRedirect: '/login',
    failureFlash: true,
  })
);


app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});


app.use((req, res) => res.status(404).render('404'));


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
