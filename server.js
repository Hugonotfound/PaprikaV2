const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
, OAuthStrategy = require('passport-oauth').OAuthStrategy;
const AzureAdOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

require('./passport-config')(passport)
app.use(passport.initialize());
app.use(passport.session());

//db
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@paprikadb.vqphd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to DB!'))

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/upload', express.static(__dirname + 'public/upload'))

//passport for office login

passport.use(new AzureAdOAuth2Strategy({
  base: 'https://login.microsoftonline.com/',
  clientID: '035fa40c-aa47-423f-9791-6882f184dd62',
  clientSecret: '4a90e143-f72e-4bed-9ec0-fffa815fc231',
  resource:  'https://graph.microsoft.com/',
  redirectURL : '/auth/azureadoauth2/callback',
  logoutURL : 'https://localhost:3000/auth/logout'
},
(accessToken, refresh_token, params, profile, cb) => {
  const userProfile = jwt.decode(params.id_token, '', true);
  console.log(userProfile.name);
  user = { ...userProfile };
  return cb(null, userProfile);
}));

app.get('/auth/azureadoauth2', passport.authenticate('azure_ad_oauth2', {
  session: false,
  scope: ["profile", "email"],
failureRedirect: '/login'
}));

app.get('/auth/azureadoauth2/callback',
passport.authenticate('azure_ad_oauth2', {
failureRedirect: '/login'
}),
function(req, res) {
console.log("get the profile");
res.redirect('/profile');
});

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'MySecret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use('/', require('./routes'));

app.get('*', function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404.ejs', { url: req.url });
    return;
  }  
  res.type('txt').send('Not found');
});

app.listen(80, () => {
  console.log('Paprika front running')
} )