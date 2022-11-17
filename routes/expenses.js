const express = require('express')
const router = express.Router()
const Expenses = require('../models/expenses')
const Suppliers = require('../models/suppliers')
const catchAsync = require('../utils/catchAsync')//if errror it sends it to error
const Items = require('../models/items')


router.get('/expenses',catchAsync( async function (req,res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    if(req.query.val){
        const d = new Date(req.query.month) // GET THIS MONTHS DATE

        const pdate = new Date(req.query.pmonth)// AND THE PREVIOUS MONTH
        const expenses = await Expenses.find({$and: [{"customerId":req.query.val},{"date": {$gte:pdate , $lte:d} }]}).sort({"date":-1,"_id":1})

        let count = await Expenses.find({$and: [{"customerId":req.query.val},{"date": {$gte:pdate , $lte:d} }]}).count()

        p=1

        res.render('corporate/expenses/allexpenses',{expenses: expenses,p:p,count:count,pdate:pdate , d: d,req:req.user})
        return
    }
    else if(req.query.p){
    const expenses = await Expenses.find({}).sort({"date":-1,"_id":1}).skip((+req.query.p - 1) * 30).limit(30)
    let count = await Expenses.find({}).count()/30
    count = Math.ceil(count)

    res.render('corporate/expenses/allexpenses',{expenses: expenses,p:req.query.p,count:count,req:req.user})
    return
    }
    else{
        const expenses = await Expenses.find({}).sort({"date":-1,"_id":1}).limit(30)
        let count = await Expenses.find({}).count()/30
        count = Math.ceil(count)
        const p = 1
    
        res.render('corporate/expenses/allexpenses',{expenses: expenses, p:p , count:count,req:req.user})
        return
    }
}
else{
 
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))


router.get('/expenses/new', function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    res.render('corporate/expenses/new',{req:req.user})
    }
})

router.get('/expenses/:id',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const expenses = await Expenses.findById(req.params.id)
    if(!expenses){
        req.flash('error','Cannot find that expense!')
        return res.redirect('/expenses')
    }
    res.render('corporate/expenses/show',{expenses: expenses,req:req.user})
}
else{
 
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.get('/expenses/:id/edit',catchAsync(async function (req,res){
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const expenses = await Expenses.findById(req.params.id)
    res.render('corporate/expenses/edit',{expenses: expenses,req:req.user})
    }
    else{
     
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.post('/expenses',catchAsync( async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const allItems = req.body

    const newexpense = new Expenses(req.body) //WE ENTER ALL DATE THAT ARE NOT IN OBJECTS

    for (let key in allItems) { //ITERATING OVER AN OBJECT
        if (typeof allItems[key] === 'object') {//CHECKING IF IT IS AN OBJECT
            newexpense.items.push(allItems[key])
        }
    }

    for(let i = 0; i < newexpense.items.length; i++) { //ALL ITEMS ARE FOUND
        if(newexpense.items[i].id){// id NOT _id
        let item = await Items.findById(newexpense.items[i].id) //THIS WE FIND THE ITEM IN ITEMS MODEL AND UPDATE
        item.quantity = item.quantity + newexpense.items[i].quantity
       
        await item.save()
        }
    }

    let activity = `Created By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    newexpense.activties.push(activity)

    newexpense.customerId = req.body.customerId

    const supplier = await Suppliers.findById(req.body.customerId)
    supplier.orders.push(newexpense)

    supplier.balance = supplier.balance + parseFloat(req.body.totalAmountAll)
    supplier.totalDebit = supplier.totalDebit + parseFloat(req.body.totalAmountAll)
    await supplier.save()
    await newexpense.save()
  
    req.flash('success','Successfully saved the expense!')
    res.redirect("/expenses")
}
else{
 
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}
}))

router.put('/expenses/:id',catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const allItems = req.body
    const newexpense = new Expenses(req.body)
    for (let key in allItems) { //ITERATING OVER AN OBJECT
        if (typeof allItems[key] === 'object') {//CHECKING IF IT IS AN OBJECT
            newexpense.items.push(allItems[key])
        }
    }

    
    for(let i = 0; i < newexpense.items.length; i++) {
        if(newexpense.items[i].id){
        let item = await Items.findById(newexpense.items[i].id)
        item.quantity = item.quantity + newexpense.items[i].quantity
        await item.save()
        }
        }
    
   
    const expense = await Expenses.findById(req.params.id) //FIRST WE FIND THE OLD ONE 

    for(let act of expense.activties){
        newexpense.activties.push(act)
    }

    let activity = `Edited By: ${req.user.username}(${new Date()})\n`
    activity += JSON.stringify(req.body)
    newexpense.activties.push(activity)
    await newexpense.save()

    for(let i = 0; i < expense.items.length; i++) {//MINUS ALL THE ITEMS
        if(expense.items[i].id){
        let item = await Items.findById(expense.items[i].id)
        item.quantity = item.quantity - expense.items[i].quantity
        await item.save()
        }
    }

    const supplierId = expense.customerId
    const supplier = await Suppliers.findById(supplierId)
  
    await Suppliers.findByIdAndUpdate(supplierId,{$pull: {orders: req.params.id} }) // THIS IS HOW WE DELETE PREVIOUS expense ID FROM ARRAY
    await supplier.orders.push(newexpense)

    supplier.balance = supplier.balance - expense.totalAmountAll +newexpense.totalAmountAll

    supplier.totalDebit = supplier.totalDebit - expense.totalAmountAll +newexpense.totalAmountAll

    await supplier.save()
    await Expenses.findByIdAndDelete(req.params.id)
    
    req.flash('success','Successfully Edited the expense')
    res.redirect(`/expenses/${newexpense._id}`)
    }    
    else{
     
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.delete('/expenses/:id',catchAsync(async function(req, res) {
    if(req.user.role === "ADMIN" || req.user.role === "ACCOUNTANT"){
    const expense = await Expenses.findById(req.params.id)
  
    for(let i = 0; i < expense.items.length; i++) {//WHEN DELETED MUST ALSO REDUCE ITEMS QUANTITY
        if(expense.items[i].id){
        let item = await Items.findById(expense.items[i].id)
        item.quantity = item.quantity - expense.items[i].quantity
        await item.save()
        }
    }


    const supplierId = expense.customerId
    const supplier = await Suppliers.findById(supplierId)
    await Suppliers.findByIdAndUpdate(supplierId,{$pull: {orders: req.params.id} })
    await Expenses.findByIdAndDelete(req.params.id)
    supplier.balance = supplier.balance - expense.totalAmountAll
    supplier.totalDebit = supplier.totalDebit - expense.totalAmountAll
    await supplier.save()

    req.flash('success','Successfully Deleted the expense')
    res.redirect(`/expenses`)
} else{
 
    req.flash('error','You must be authorized')
    return res.redirect('/home');
}

}))

module.exports = router