const express = require('express')
const routes = require('./routes.js')
const dotenv = require("dotenv")
const cors = require("cors")
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');


const app = express()
dotenv.config();

const clientUrl = process.env.CLIENT_URL

app.use(cors({
  origin: clientUrl,
  credentials: true
})) // allows clientUrl to make requests

app.use(express.json()) // places readable json into req.body
app.use(express.urlencoded({ extended: false })); // creates object from form in req.body
app.use(express.static("public")); // allows access to public folder
app.use(passport.initialize())
app.use(cookieParser())

//middleware for jwt to extract access_token from cookie
const cookieExtractor = (req, res) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['access_token']
        return token

    } else {
        console.log('No token found..')
        return token
    }
}

//Used for validating web tokens
passport.use(new JwtStrategy(
  {
    //use the middleware and secret_key to regenerate the user's id
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
  },
  //defaults to outputing a payload with id prop, check db if id is real
  async (payload, done) => {
    //search db for payload.id
    const user = {}
    return user ? done(null, user) : done(null, false)
  }
))


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      //Fetch username from db
      const user = {}
      // if (!user) {
      //   return done(null, false, { message: "Incorrect username" });
      // }
      // const match = await bcrypt.compare(password, user.password);
      // if (!match) {
      //   return done(null, false, { message: "Incorrect password" })
      // }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);




app.use(routes)



const PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});