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
const User = require("./models/Event")

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

passport.use(new AzureAdOAuth2Strategy({
  base: 'https://login.microsoftonline.com/',
  clientID: 'df3f0c32-e8bb-4845-a88a-266759d672ab',
  clientSecret: '26e27bbd-d61a-4a65-8231-effc8476d19b',
  resource:  'https://graph.microsoft.com/',
  redirectURL : '/auth/azureadoauth2/callback',
  logoutURL : 'https://localhost/login'
},
function (accessToken, refresh_token, params, profile, done) {
  var decodedProfile = profile || jwt.decode(params.id_token, '', true);

  console.log(decodedProfile);
}
));

app.get('/auth/azureadoauth2', passport.authenticate('azure_ad_oauth2', {
  session: false,
  scope: ["profile"],
failureRedirect: '/login'
}));

app.get('/auth/azureadoauth2/callback',
passport.authenticate('azure_ad_oauth2', {
failureRedirect: '/login'
}),
function(req, res) {
console.log("get the profile");
res.redirect('/');
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