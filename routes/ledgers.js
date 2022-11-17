const express = require('express')
const router = express.Router()
const Ledgers = require('../models/ledgers')
const Clients = require('../models/clients')
const catchAsync = require('../utils/catchAsync')//if errror it sends it to error


router.get('/ledgers',catchAsync( async function (req, res){
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    if(req.query.val){
        const d = new Date(req.query.month)

        const pdate = new Date(req.query.pmonth)

        const ledgers = await Ledgers.find({$and: [{"customerId":req.query.val},{"date": {$gte:pdate , $lte:d} }]}).sort({"date":-1,"_id":1})
        let count = await Ledgers.find({$and: [{"customerId":req.query.val},{"date": {$gte:pdate , $lte:d} }]}).count()
        const p = 1

        res.render('corporate/ledgers/allLedgers', {ledgers, p: p,count:count,req:req.user})
        return
    }
    else if(req.query.p){
    const ledgers = await Ledgers.find({}).sort({"date":-1,"_id":1}).skip((+req.query.p - 1) * 30).limit(30)
    let count = await Ledgers.find({}).count()/30
    count = Math.ceil(count)

    res.render('corporate/ledgers/allLedgers', {ledgers, p: req.query.p,count:count,req:req.user})
    return
    }
    else{
        const ledgers = await Ledgers.find({}).sort({"date":-1,"_id":1}).limit(30)
        let count = await Ledgers.find({}).count()/30
        count = Math.ceil(count)
        const p = 1

        res.render('corporate/ledgers/allLedgers', {ledgers, p: p,count:count,req:req.user})
        return
    }
    }
    else{
      
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.get('/ledgers/new', function (req, res){
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    res.render('corporate/ledgers/new',{req:req.user})
    }
    else{
      
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
})

router.get('/ledgers/:id/edit',catchAsync( async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const ledgers = await Ledgers.findById(req.params.id)
    const clients = await Clients.findById(ledgers.customerId) 
    res.render('corporate/ledgers/edit', { ledgers,clients,req:req.user })
    }
    else{
      
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))


router.post('/ledgers/new',catchAsync( async function (req, res){  
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const newledger = new Ledgers(req.body)
    let activity = `Created By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    newledger.activties.push(activity)
   
    const client = await Clients.findById(req.body.customerId)
   
    client.totalCredit = client.totalCredit + parseFloat(newledger.amount)
    client.balance = client.balance - parseFloat(newledger.amount)
    await client.save()
    await newledger.save()
    req.flash('success', 'Successfully created a new Ledger!')//we will setup a middleware in index.js
    res.redirect("/ledgers")
    }
    else{
      
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.put('/ledgers/:id',catchAsync( async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const { id } = req.params

    const ledgers = await Ledgers.findByIdAndUpdate(id, {...req.body} );
    let activity = `Edited By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    ledgers.activties.push(activity)
    ledgers.save()

    const clients = await Clients.findById(ledgers.customerId)

    clients.totalCredit = clients.totalCredit - parseFloat(ledgers.amount) + parseFloat(req.body.amount)

    clients.balance = clients.balance + parseFloat(ledgers.amount) - parseFloat(req.body.amount)

    await clients.save()
    req.flash('success', 'Successfully updated Ledger!')
    res.redirect("/ledgers")
    }
    else{
      
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.delete('/ledgers/:id',catchAsync( async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const { id } = req.params
    const ledger = await Ledgers.findById(id)
    const client = await Clients.findById(ledger.customerId)
    client.balance = client.balance + ledger.amount
    client.totalCredit = client.totalCredit - ledger.amount
    client.save()
    ledger.delete()
    req.flash('success', 'Successfully Deleted the ledger')
    res.redirect("/ledgers")
    }
    else{
      
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

module.exports = router