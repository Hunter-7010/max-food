const express = require('express')
const router = express.Router()
const Items = require('../models/items')
const catchAsync = require('../utils/catchAsync')//if errror it sends it to error

const {validateItem} = require('../middleware')


router.get('/home',function (req, res) {
    res.render('corporate/items/home',{req:req.user})
})

router.get('/items',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    if (req.query.val){
        const query = req.query.val
        const search = await Items.find({$text:{$search:query}})// YOU CREATE THIS IN MONGO COMPASS AN INDEX

        res.render('corporate/items/search', { search: search,req:req.user})
        return
    }
    else if(req.query.p){
        const items = await Items.find({}).sort({"quantity":-1,"_id":1}).skip((+req.query.p - 1) * 30).limit(30)
        let count = await Items.find({}).count()/30
        count = Math.ceil(count)


        res.render('corporate/items/allItems', { items,p: req.query.p,count:count,req:req.user})
        return
    }
    else{
    const items = await Items.find({}).sort({"quantity":-1}).limit(30)
    let count = await Items.find({}).count()/30
    count = Math.ceil(count)
    const p = 1
    res.render('corporate/items/allItems', { items,p: p,count:count,req:req.user})
    return
    }
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.get('/items/new',function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    res.render('corporate/items/new',{req:req.user})
    }
})
router.get('/items/:id',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const items = await Items.findById(req.params.id)
    if(!items){
        req.flash('error','Cannot find that item!')
        return res.redirect('/items')
    }
    res.render('corporate/items/show',{items,req:req.user})
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.get('/items/:id/edit',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const items = await Items.findById(req.params.id)
    res.render('corporate/items/edit',{items,req:req.user})
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))


router.post('/items',validateItem,catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const newitm = new Items(req.body.item)
    let activity = `Created By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    newitm.activties.push(activity)
    await newitm.save()
    req.flash('success','Successfully created a new item!')//we will setup a middleware in index.js
    res.redirect(`/items/${newitm._id}`)
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.put('/items/:id',validateItem,catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const {id} = req.params
    const items = await Items.findByIdAndUpdate(id,{...req.body.item});//TO UNWRAP IT FROM ITEM OBJECT
    let activity = `Edited By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    items.activties.push(activity)
    items.save()
    req.flash('success','Successfully updated the item!')
    res.redirect(`/items/${items._id}`)
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.delete('/items/:id',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const {id} = req.params
    await Items.findByIdAndDelete(id)
    req.flash('success','Successfully Deleted the item')
    res.redirect(`/items`)
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

module.exports = router