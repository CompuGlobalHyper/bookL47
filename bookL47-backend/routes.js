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

router.get('/api/me', (req, res, next) => {
  passport.authenticate( "jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err)
    }
    req.user = user[0] || null
    next()
  })(req, res, next)
}, controllers.meGet)

router.post('/login', 
    passport.authenticate(
    "local", { session: false }),
    controllers.loginPost)

router.post('/register', controllers.registerPost)

router.get('/logout', controllers.logoutGet)

//routes to populate db and gain google auth
router.get('/auth/google', controllers.googleAuthGet)
router.get('/auth/google/callback', controllers.googleAuthCallbackGet)
router.get('/calendar', controllers.calendarGet)
router.get('/jotform', controllers.jotformGet)

module.exports = router