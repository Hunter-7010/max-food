const express = require('express')
const router = express.Router()
const Orders = require('../models/orders')
const Clients = require('../models/clients')
const catchAsync = require('../utils/catchAsync')//if errror it sends it to error
const Items = require('../models/items')


router.get('/orders',catchAsync( async function (req,res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    if(req.query.p){
    const orders = await Orders.find({}).sort({"date":-1,"_id":1}).skip((+req.query.p - 1) * 30).limit(30)
    let count = await Orders.find().count()/30
    count = Math.ceil(count)
    res.render('corporate/orders/allOrders',{orders: orders, p: req.query.p, count:count,req:req.user})
    return
    }
    else{
        const orders = await Orders.find().sort({"date":-1}).limit(30)
        let count = await Orders.find().count()/30
        count = Math.ceil(count)
        const p = 1


        res.render('corporate/orders/allOrders',{orders: orders, p: p, count:count,req:req.user})
        return
    }
} else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}

}))

router.get('/orders/print/:id',catchAsync( async function (req, res){
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const order = await Orders.findById(req.params.id)
    const clientId = order.customerId
    const client = await Clients.findById(clientId)

    res.render('corporate/orders/print',{order: order, client: client,req:req.user})
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))


router.get('/orders/new', function (req, res) { 
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    res.render('corporate/orders/new',{req:req.user})
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
})

router.get('/orders/routes',catchAsync( async function (req, res){
    if(req.user.role === "ADMIN" || req.user.role === "ORDER" || req.user.role === "BASIC"){ 
    if (req.query.val && req.query.s) {
        const query = req.query.val
        const d = new Date(query)
        const orders = await Orders.find({$and:[ {"date":d },{"route":req.query.s} ] } ).sort({"route":1})
       
        allItems = [] //HERE WE FORM AN EMPTY ARRAY
        for(let order of orders){ //AND WE FILL IT WITH ALL THE ITEMS
            for(let item of order.items){
                allItems.push(item)
            }
        }
      

        result = Object.values(allItems.reduce((r,{name,price,quantity,amount}) => {//AND HERE WE FILTER THE ITEMS
          r[name] = r[name] || {name, price,quantity : 0,amount};// that is why quantity adds up while the others dont
          r[name].quantity += quantity;
          return r;
        },{}));//EMPTY OBJECT FOR THE INTIALIZER

        let sum = 0
        for(let item of result){ //FOR TOTAL KG
            sum = sum + item.amount*item.quantity
        }

        res.render('corporate/orders/routes', { orders: orders,result: result,sum:sum,req:req.user})
        return
    } 
    else if(req.query.val){
        if (req.query.val) {
            const query = req.query.val
            const d = new Date(query)
            const orders = await Orders.find({"date":d }).sort({"route":1})
           
            allItems = []
            for(let order of orders){
                for(let item of order.items){
                    allItems.push(item)
                }
            }
          
    
            result = Object.values(allItems.reduce((r,{name,price,quantity,amount}) => {
              r[name] = r[name] || {name, price,quantity : 0,amount};// that is why quantity adds up while the others dont
              r[name].quantity += quantity;
              return r;
            },{}));
    
            let sum = 0
            for(let item of result){
                sum = sum + item.amount*item.quantity
            }
            res.render('corporate/orders/routes', { orders: orders,result: result,sum:sum,req:req.user})
            return
        }
    }
    else {
        const orders =  await Orders.find().sort({"date":-1,"route":1,}).limit(30)

        allItems = []
        for(let order of orders){
            for(let item of order.items){
                allItems.push(item)
            }
        }
      

        result = Object.values(allItems.reduce((r,{name,price,quantity,amount}) => {
          r[name] = r[name] || {name, price,quantity : 0,amount};
          r[name].quantity += quantity;
          return r;
        },{}));

        let sum = 0
        for(let item of result){
            sum = sum + item.amount*item.quantity
        }
        res.render('corporate/orders/routes',{orders: orders,result:result,sum:sum,req:req.user});
        return
    }
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.get('/orders/:id',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const orders = await Orders.findById(req.params.id)
    if(!orders){
        req.flash('error','Cannot find that order!')
        return res.redirect('/orders')
    }
    res.render('corporate/orders/show',{orders: orders,req:req.user})
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.get('/orders/:id/edit',catchAsync(async function (req,res){
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const orders = await Orders.findById(req.params.id)
    res.render('corporate/orders/edit',{orders: orders,req:req.user})
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))


router.post('/orders',catchAsync( async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const allItems = req.body
    const newOrder = new Orders(req.body)

    for (let key in allItems) { //ITERATING OVER AN OBJECT
        if (typeof allItems[key] === 'object') {//CHECKING IF IT IS AN OBJECT
            newOrder.items.push(allItems[key])
        }
    }

    let total = 0

    for(let i = 0; i < newOrder.items.length; i++) {
        if(newOrder.items[i].id){//id is the item id
        let item = await Items.findById(newOrder.items[i].id)
        item.quantity = item.quantity - newOrder.items[i].quantity
            if(newOrder.items[i].amount ===null || newOrder.items[i].amount === 0){
                total = total + item.buyPrice*newOrder.items[i].quantity
            } else{
            total = total + item.buyPrice*newOrder.items[i].quantity*newOrder.items[i].amount
            }
        await item.save()
        }
    }

    newOrder.buyPrice = total

    let activity = `Created By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    newOrder.activties.push(activity)

    newOrder.customerId = req.body.customerId //now find the client
    const client = await Clients.findById(req.body.customerId)
    client.orders.push(newOrder)
    newOrder.preBalance = client.balance
    newOrder.nip = client.nip
    client.balance = client.balance + parseFloat(req.body.totalAmountAll)
    client.totalDebit = client.totalDebit + parseFloat(req.body.totalAmountAll)
    await client.save()
    await newOrder.save()
  
    req.flash('success','Successfully saved the order!')
    res.redirect("/orders")
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.put('/orders/:id',catchAsync( async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const allItems = req.body
    const newOrder = new Orders(req.body)
    for (let key in allItems) { //ITERATING OVER AN OBJECT
        if (typeof allItems[key] === 'object') {//CHECKING IF IT IS AN OBJECT
            newOrder.items.push(allItems[key])
        }
    }
    
    let total = 0

    for(let i = 0; i < newOrder.items.length; i++) {
        if(newOrder.items[i].id){
            let item = await Items.findById(newOrder.items[i].id)
            item.quantity = item.quantity - newOrder.items[i].quantity

                if(newOrder.items[i].amount === null || newOrder.items[i].amount === 0){
                    total = total + item.buyPrice*newOrder.items[i].quantity
                } else{
                    total = total + item.buyPrice*newOrder.items[i].quantity*newOrder.items[i].amount
                }
            await item.save()
        }
    }
    newOrder.buyPrice = total
    
    const order = await Orders.findById(req.params.id) //now the old order

    newOrder.preBalance = order.preBalance

    for(let act of order.activties){
        newOrder.activties.push(act)
    }

    let activity = `Edited By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    newOrder.activties.push(activity)


    for(let i = 0; i < order.items.length; i++) { //we add the item quantity of the old
        if(order.items[i].id){
        let item = await Items.findById(order.items[i].id)
        item.quantity = item.quantity + order.items[i].quantity
        await item.save()
        }
    }

    const clientId = order.customerId
    const client = await Clients.findById(clientId)

    
    newOrder.nip = client.nip
    await Clients.findByIdAndUpdate(clientId,{$pull: {orders: req.params.id} }) // THIS IS HOW WE DELETE PREVIOUS ORDER ID FROM ARRAY
    await client.orders.push(newOrder)
    client.balance = client.balance - order.totalAmountAll +newOrder.totalAmountAll
    client.totalDebit = client.totalDebit - order.totalAmountAll +newOrder.totalAmountAll
    
    await newOrder.save()
    await client.save()
    await Orders.findByIdAndDelete(req.params.id)
    


    req.flash('success','Successfully Edited the order')
    res.redirect(`/orders/${newOrder._id}`)
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.delete('/orders/:id',catchAsync(async function(req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ORDER"){ 
    const order = await Orders.findById(req.params.id)
  
    for(let i = 0; i < order.items.length; i++) {
        if(order.items[i].id){
        let item = await Items.findById(order.items[i].id)
        item.quantity = item.quantity + order.items[i].quantity
        await item.save()
        }
    }


    const clientId = order.customerId
    const client = await Clients.findById(clientId)
    await Clients.findByIdAndUpdate(clientId,{$pull: {orders: req.params.id} })
    await Orders.findByIdAndDelete(req.params.id)

    client.balance = client.balance - order.totalAmountAll
    client.totalDebit = client.totalDebit - order.totalAmountAll
    await client.save()

    req.flash('success','Successfully Deleted the order')
    res.redirect(`/orders`)
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

module.exports = router