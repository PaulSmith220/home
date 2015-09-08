var express = require('express'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    TwitterStrategy = require('passport-twitter'),
    GoogleStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook'),
    mongoose = require('mongoose'),
    config = require("./config.js")

var User = require("./models/User").User;

    mongoose.connect(config.url);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
      console.log('DB CONNECTED');
    });



var app = express();

//===============PASSPORT===============



//===============EXPRESS================
// Configure Express
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main', //we will be creating this layout shortly
    helpers: {
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');




//===========PASSPORT=====================

var LocalStrategy  = LocalStrategy.Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password,done){
  User.findOne({ username : username},function(err,user){
    return err 
      ? done(err)
      : user
        ? password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' })
        : done(null, false, { message: 'Incorrect username.' });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err 
      ? done(err)
      : done(null,user);
  });
});







//===================================

//===============ROUTES===============


app.use('/static', express.static(__dirname + '/bower_components/'));
app.use('/scripts', express.static(__dirname + '/build/scripts/'));
app.use('/styles', express.static(__dirname + '/build/styles/'));


var userCtrl = require("./controllers/users.js");

app.all('private', userCtrl.mustAuthenticatedMw);
app.all('private/*', userCtrl.mustAuthenticatedMw);

app.post('/login',                  userCtrl.login);
app.post('/register',               userCtrl.register);
app.get('/logout',                  userCtrl.logout);

app.get('/private', function(req, res) {
  res.render('private', {user: req.user});
});

//displays our homepage
app.get('/', function(req, res){
  res.render('home', {user: req.user});
});


// //sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
// app.post('/local-reg', passport.authenticate('local-signup', {
//   successRedirect: '/',
//   failureRedirect: '/signin'
//   })
// );

// //sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
// app.post('/login', passport.authenticate('local-signin', { 
//   successRedirect: '/',
//   failureRedirect: '/signin'
//   })
// );

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

//===============PORT=================
var port = process.env.PORT || 5000; //select your port or let it pull from your .env file
app.listen(port);
console.log("listening on " + port + "!");