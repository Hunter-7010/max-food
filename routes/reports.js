const express = require('express')
const router = express.Router()
const Clients = require('../models/clients')
const Items = require('../models/items')
const Orders = require('../models/orders')
const Suppliers = require('../models/suppliers')
const Expenses = require('../models/expenses')
const User = require('../models/user')

const catchAsync = require('../utils/catchAsync')//if errror it sends it to error


router.get('/reports',catchAsync( async function (req, res) {
    if(req.user.role === "ADMIN"){
    const clientCounts = await Clients.find().count()
    const supplierCounts = await Suppliers.find().count()
    const itemCounts = await Items.find().count()

    const today = new Date()
    today.setUTCHours(0,0,0,0)

    const ordersToday = await Orders.find({"date":today}).count()
    
    const mStart = new Date(today.getFullYear(),today.getMonth(),2)

    const mEnd = new Date(today.getFullYear(),today.getMonth()+1)

    const lmStart = new Date(today.getFullYear(),today.getMonth()-1,2)

    const lmEnd = new Date(today.getFullYear(),today.getMonth())

    

    const orders = await Orders.find({ $and:[ {"date":{ $gte:mStart,$lte:mEnd} } ] })

    const ordersCount = await Orders.find({ $and:[ {"date":{ $gte:lmStart,$lte:lmEnd} } ] }).count()

    let totalMonth = 0
    let totalActual = 0
    for(let order of orders){
        totalMonth = totalMonth + order.totalAmountAll
        totalActual = totalActual + order.buyPrice
    }

    const lOrders = await Orders.find({ $and:[ {"date":{ $gte:lmStart,$lte:lmEnd} } ] })
    let totalLastMonth = 0
    let totalActualLast = 0
    for(let order of lOrders){
        totalLastMonth = totalLastMonth + order.totalAmountAll
        totalActualLast = totalActualLast + order.buyPrice
    }

    const expenses = await Expenses.find({ $and:[ {"date":{ $gte:mStart,$lte:mEnd} } ]})

    let totalEx = 0

    for(let expense of expenses){
        totalEx = totalEx +expense.totalAmountAll
    }

    const lExpenses = await Expenses.find({ $and:[ {"date":{ $gte:lmStart,$lte:lmEnd} } ]})

    let lTotalEx = 0

    for(let expense of lExpenses){
        lTotalEx = lTotalEx +expense.totalAmountAll
    }


    res.render('corporate/home',{clientCounts:clientCounts, supplierCounts:supplierCounts
         , itemCounts:itemCounts, ordersToday:ordersToday,req:req.user,
           totalMonth:totalMonth, totalActual:totalActual, totalLastMonth:totalLastMonth, totalActualLast:totalActualLast,
            ordersCount:ordersCount ,totalEx:totalEx, lTotalEx:lTotalEx })
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
}))

router.get('/register', function (req, res) {
    if(req.user.role === "ADMIN"){
    res.render('corporate/users/register',{req:req.user})
    }
    else{
        
        req.flash('error','You must be authorized')
        return res.redirect('/home');
    }
});
router.post('/register', catchAsync(async function (req, res) {
    if(req.user.role === "ADMIN"){
    try {
        const { email, password, username,role } = req.body
        const user = new User({ email, username,role });
        const registerdUser = await User.register(user, password);//hashes the password and stores it in data base
        res.redirect('/items')
        req.flash('success', 'Successfully Registered a new user')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}
else{
    
    req.flash('error','You must be authorized')
    return res.redirect(req.session.returnTo || '/home');
}
}))

router.get('/profile', catchAsync(async function (req,res){
    const user = req.user
    res.render('corporate/users/profile',{user: user,req:req.user})
}))

router.post('/profile', catchAsync(async function (req,res){
    const user = await User.findById(req.user._id);
    await user.changePassword(req.body.password, req.body.newPassword)
    res.redirect('/home')
    req.flash('success', 'Successfully Changed password');
  
}))

module.exports = router 

