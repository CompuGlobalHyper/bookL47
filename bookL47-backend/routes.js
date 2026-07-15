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
    req.user = user || null
    next()
  })(req, res, next)
}, controllers.meGet)

router.post('/login', 
    passport.authenticate(
    "local", { session: false }),
    controllers.loginPost)

router.post('/register', controllers.registerPost)
router.get('/logout', controllers.logoutGet)
router.post('/password-forgot', controllers.passwordForgot)
router.post('/password-reset', controllers.passwordReset)

router.get('/bookings', authUser, controllers.bookingsGet)
router.put('/cancel', authUser, controllers.bookingsCancel)



router.get('/cart', authUser, controllers.cartGet)
router.post('/cart', authUser, controllers.cartPost)
router.delete('/cart', authUser, controllers.cartDelete)
router.put('/cart', authUser, controllers.cartPut)

router.get('/checkout', authUser, controllers.checkoutGet)
router.post('/checkout', authUser, controllers.checkoutPost)

router.post('/payment', authUser, controllers.paymentPost)


//routes to populate db and gain google auth
router.get('/auth/google', controllers.googleAuthGet)
router.get('/auth/google/callback', controllers.googleAuthCallbackGet)
router.get('/calendar', authUser, controllers.calendarGet)
router.get('/rooms', authUser, controllers.roomsGet)
router.get('/jotform', controllers.jotformGet)

module.exports = router