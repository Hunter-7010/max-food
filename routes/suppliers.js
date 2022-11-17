const express = require('express')
const router = express.Router()
const Suppliers = require('../models/suppliers')
const catchAsync = require('../utils/catchAsync')//if errror it sends it to error

const {validateSupplier} = require('../middleware')

router.get('/suppliers',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    if (req.query.val) {
        const query = req.query.val
        const search = await Suppliers.find({ $text: { $search: query } })// YOU CREATE THIS IN MONGO COMPASS AN INDEX
        res.render('corporate/suppliers/search', { search: search,req:req.user })
        return
    } 
    else if(req.query.p){
        const suppliers = await Suppliers.find({}).skip((+req.query.p - 1) * 30).limit(30)
        let count = await Suppliers.find({}).count()/30
        count = Math.ceil(count)

        res.render('corporate/suppliers/allSuppliers', { suppliers, p: req.query.p,count:count,req:req.user})
        return
    }
    else {
        const suppliers = await Suppliers.find({}).limit(30)
        let count = await Suppliers.find({}).count()/30
        count = Math.ceil(count)
        const p= 1
        res.render('corporate/suppliers/allSuppliers', { suppliers,p: p,count:count,req:req.user})
        return
    }
} else{
   
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}

}))
router.get('/suppliers/new',function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    res.render('corporate/suppliers/new',{req:req.user})
    }
})
router.get('/suppliers/:id',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const suppliers = await Suppliers.findById(req.params.id)
    if(!suppliers){
        req.flash('error','Cannot find this supplier!')
        return res.redirect('/suppliers')
    }
    res.render('corporate/suppliers/show',{suppliers,req:req.user})
}
else{
   
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))
router.get('/suppliers/:id/edit',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const suppliers = await Suppliers.findById(req.params.id)
    res.render('corporate/suppliers/edit',{suppliers,req:req.user})
    }
    else{
       
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))


router.post('/suppliers',validateSupplier,catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const newsupplier = new Suppliers(req.body.supplier)
    let activity = `Created By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    newsupplier.activties.push(activity)

    await newsupplier.save()
    req.flash('success','Successfully created a new supplier!')//we will setup a middleware in index.js
    res.redirect(`/suppliers/${newsupplier._id}`)
    }
    else{
       
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.put('/suppliers/:id',validateSupplier,catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const {id} = req.params
    const suppliers = await Suppliers.findByIdAndUpdate(id,{...req.body.supplier});//TO UNWRAP IT FROM ITEM OBJECT
    let activity = `Edited By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    suppliers.activties.push(activity)
    suppliers.save()
    req.flash('success','Successfully updated supplier!')
    res.redirect(`/suppliers/${suppliers._id}`)
    }
    else{
       
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.delete('/suppliers/:id',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const {id} = req.params
    await Suppliers.findByIdAndDelete(id)
    req.flash('success','Successfully Deleted the supplier')
    res.redirect(`/suppliers`)
    }
    else{
       
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))
 module.exports = router