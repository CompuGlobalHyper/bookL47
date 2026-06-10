const express = require('express')
const passport = require("passport")
const controllers = require('./controllers.js')

const router = express.Router()

//auth user based on the web token created on login
const authUser = passport.authenticate(
        "jwt", { session: false }
    )
//auth access based on role attached to user
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.sendStatus(401);
    }
    if (req.user.role === "admin") {
      return next();
    }

    if (roles.includes(req.user.role)) {
      return next();
    }
    return res.sendStatus(403);
  };
};

router.post('/login', 
    passport.authenticate(
    "local", { session: false }),
    controller.loginPost)

//routes to populate db and gain google auth
router.get('/auth/google', controllers.googleAuthGet)
router.get('/auth/google/callback', controllers.googleAuthCallbackGet)
router.get('/calendar', controllers.calendarGet)
router.get('/jotform', controllers.jotformGet)

module.exports = router