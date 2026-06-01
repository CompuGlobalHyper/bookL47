const express = require('express')
const routes = require('./routes.js')
const dotenv = require("dotenv")


const app = express()
dotenv.config();



app.use(routes)
const PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});