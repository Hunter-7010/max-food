const express = require('express')
const router = express.Router()
const Clients = require('../models/clients')
const catchAsync = require('../utils/catchAsync')//if errror it sends it to error
const {validateClient} = require('../middleware')



router.get('/clients', catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
        if (req.query.val) {
            const query = req.query.val
            const search = await Clients.find({ $text: { $search: query } }).limit(30) //SORTED BY BALANCE
        
            // YOU CREATE $text IN MONGO COMPASS AN INDEX
            res.render('corporate/clients/search', { search: search,req:req.user})
            return
        } 
        else if(req.query.p){
            const clients = await Clients.find().sort({"balance":-1,"_id":1}).skip((+req.query.p - 1) * 30).limit(30)
                            // _id is USED TO SHOW CLIENT WITH SAME ID IF IT OCCURS               THIS TIMES THE LIMIT
            let count = await Clients.find().count()/30
            count = Math.ceil(count) //THIS IS NOT RETURN DECIMAL NUMBERS

            res.render('corporate/clients/allClients', { clients, p:req.query.p,count:count,req:req.user })
            return
        }
        else {
            // if no queries then this
            const clients = await Clients.find().sort({"balance":-1}).limit(30)
            let count = await Clients.find().count()/30
            count = Math.ceil(count)

            const p = 1
            res.render('corporate/clients/allClients', { clients,p:p,count:count,req:req.user })
            return
        }
    }
    else{
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.get('/clients/:id/specialPrice', catchAsync(async function (req, res){
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const clients = await Clients.findById(req.params.id)
    res.render('corporate/clients/specialPrice', { clients,req:req.user })
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.get('/clients/new', function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    res.render('corporate/clients/new',{req:req.user})
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
})
router.get('/clients/:id', catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const clients = await Clients.findById(req.params.id)
    if (!clients) {
        req.flash('error', 'Cannot find this client!')
        return res.redirect('/clients')
    }
    res.render('corporate/clients/show', { clients,req:req.user })
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.get('/clients/:id/edit', catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const clients = await Clients.findById(req.params.id)
    res.render('corporate/clients/edit', { clients,req:req.user })
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.get('/clients/orders/:id', catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    let p = 1
    if(req.query.p){//if page query is passed
       p = req.query.p
    }
    const clientOrders = await Clients.findById(req.params.id).populate({ //WE POPULATE ORDERS FIELD
        path: 'orders',
        options: { //THIS HOW WE ADD OPTIONS IN POPULATED FIELD
            sort: {"date":-1,"_id":1},
            skip: (+p - 1) *30,//TIMES THE LIMIT
            limit: 30
        }
    })

    const orderC = await Clients.findById(req.params.id).populate({//THIS IS CREATE TO 
        path: 'orders',
    })

    let count =  orderC.orders.length / 30 //COUNT IS USED FOR PAGINATION
    count = Math.ceil(count)

    res.render('corporate/clients/clientOrders', { clientOrders:clientOrders,p:p,count:count,req:req.user })
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))


router.post('/clients', validateClient, catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const newclient = new Clients(req.body.client)
    let activity = `Created By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    
    newclient.activties.push(activity)
    await newclient.save()
    req.flash('success', 'Successfully created a new Client!')//we will setup a middleware in index.js
    res.redirect(`/clients/${newclient._id}`)
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.post('/clients/:id/specialPrice',catchAsync( async function (req, res){ //ONE PAGE FOR SHOWING POSTING AND UPDATING
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const client = await Clients.findById(req.params.id)
    client.specialPrice = [] //WE INTIALIZE IT FIRST
    allItems = req.body
    for(let key in allItems){ // THIS USED TO ONLY TAKE INPUTS THAT ARE IN OBJECTS
        if (typeof allItems[key] === 'object'){
            client.specialPrice.push(allItems[key])
        }
    }
    let activity = `Special pirce - Created By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    client.activties.push(activity)
    await client.save()
   res.redirect(`/clients/${client._id}`)
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.put('/clients/:id', validateClient, catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const { id } = req.params
    const clients = await Clients.findByIdAndUpdate(id, { ...req.body.client });//TO UNWRAP IT FROM ITEM OBJECT
    let activity = `Edited By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    clients.activties.push(activity)
    clients.save()
    req.flash('success', 'Successfully updated Client!')
    res.redirect(`/clients/${clients._id}`)
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.delete('/clients/:id', catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const { id } = req.params
    const client = await Clients.findById(id)
    let activity = `${req.user.username}(${new Date()})Deleted:\n${client.name} ${client.address}`
    await Clients.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted the client')
    res.redirect(`/clients`)
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))
module.exports = router