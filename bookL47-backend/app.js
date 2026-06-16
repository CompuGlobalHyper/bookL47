const express = require('express')
const routes = require('./routes.js')
const dotenv = require("dotenv")
const cors = require("cors")
const passport = require('passport');
const { createClient } = require('@supabase/supabase-js')
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

//create Supabase client
function supabaseClient () {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SECRET_KEY
    )
}

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
    const supabase = supabaseClient()
    const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq("id", `${payload.id}`)
    const user = data
    return user ? done(null, user) : done(null, false)
  }
))


passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const supabase = supabaseClient()
      const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq("email", `${email}`)
      
      if (error) return console.log(error)
      const user = data[0]
       if (!user) {
         return done(null, false, { message: "Invalid email address/password" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect email address/password" })
      }
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