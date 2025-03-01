/*Example Workflow:
 this is we have used for development purposes only to smooth line our experience
    Install nodemon:
    bash
    Copy

    npm i --save-dev nodemon

    Add a script to package.json:
    json
    Copy

    "scripts": {
      "start": "nodemon app.js"
    }

    Run your app in development mode:
    bash
    Copy

    npm run start

Now, your server will auto-restart whenever you save changes to your code! 🚀

Key Takeaway:
nodemon is a developer tool for convenience during coding, not a package your app needs to run in production.*/

const express = require("express")
const session = require("express-session")
const passport = require("passport")
require('./auth')
function isloggedIn(req,res,next){
    req.user ? next(): res.sendStatus(401);
}

const app = express()
app.use(session({secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());





app.get('/',(req,res)=>{
    res.send('<a href = "/auth/google">Authenticate with google</a>')
})

app.get('/auth/google',
    passport.authenticate('google',{scope: ['email','profile']})
)
app.get('/auth/google/callback',
    passport.authenticate('google',{
        successRedirect: '/protected',
        failureRedirect: '/auth/failure',
    })
)
app.get('/protected',isloggedIn,(req,res)=>{
    res.send("Hello!")
})
app.get('/auth/failure',()=>{
    res.send("Something went wrong..")
})

app.listen(3000,()=>{
    console.log("listening on port 3000")
})