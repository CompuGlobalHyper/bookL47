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


app.use(routes)
const PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});