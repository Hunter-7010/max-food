const express = require('express')
const router = express.Router()

router.get('/',function (req, res){
    res.render('show/index')
})

router.get('/about',function (req, res){
    res.render('show/about')
})

router.get('/contact',function (req, res){
    res.render('show/contact')
})

router.get('/rest',function (req, res){
    res.render('show/rest')
})

module.exports = router