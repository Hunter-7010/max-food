const { clientSchema,itemSchema,supplierSchema } = require('./schemas.js')//SINCE WE ARE EXPORTING MULTIPLE THINGS
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = function(req, res, next) {//THIS CHECKS IF YOU ARE LOGGED IN
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You must be signed in')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateClient = function (req, res, next) {
    const { error } = clientSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')//THIS MESSAGE IS AN ARRAY WE HAVE TO MAP OVER IT
        throw new ExpressError(msg, 400)
    }
    else {
        return next()
    }
}


module.exports.validateItem = function(req, res, next) {
    const {error} = itemSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ')//THIS MESSAGE IS AN ARRAY WE HAVE TO MAP OVER IT
        throw new ExpressError(msg,400)
    }
    else{
        return next()
    }
}

module.exports.validateSupplier = function(req, res, next) {
    const {error} = supplierSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ')//THIS MESSAGE IS AN ARRAY WE HAVE TO MAP OVER IT
        throw new ExpressError(msg,400)
    }
    else{
        return next()
    }
}