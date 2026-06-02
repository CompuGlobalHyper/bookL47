const express = require('express')
const controllers = require('./controllers.js')

const router = express.Router()

router.get('/auth/google', controllers.googleAuthGet)
router.get('/auth/google/callback', controllers.googleAuthCallbackGet)

router.get('/calendar', controllers.calendarGet)
router.get('/jotform', controllers.jotformGet)

module.exports = router