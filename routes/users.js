const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

router.get('/login', function (req, res) {
    res.render('corporate/users/login')
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), function (req, res) {//local IN AUTHENTICATE IS THE STRATEGY NAME
    req.flash('success', 'Welcome Back!')
    const redirectUrl =  req.session.returnTo ||'/home'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})
router.get('/logout', function (req, res) {
    req.logout()
    req.flash('success', 'Loged Out!')
    res.redirect('/')
})

module.exports = router 