const passport = require("passport");

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const GOOGLE_CLIENT_ID ='1035965898856-tagspa80aqhbm9kjan50dtlcljssijus.apps.googleusercontent.com' 
const GOOGLE_CLIENT_SECRET = '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'
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user,done){
    done(null,user);
})
passport.deserializeUser(function(user,done){
    done(null,user);
})