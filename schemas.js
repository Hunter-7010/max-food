const Joi = require('joi')//THIS IS USED TO CATCH ERROR AND MAKE ERROR SCHEMAS.  VERY USEFUL
module.exports.itemSchema = Joi.object({// if(!req.body.campground){throw new ExpressError('Invalid campground date',400)}
  item: Joi.object({//BECAUSE EVERYTHING IS SAVED UNDER Campground THAT IS WHY WE HAVE TO DO IT TWICE
      itemName: Joi.string().required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().min(0).required(),
      unit: Joi.string().required(),
      amount:Joi.number().allow('null').allow('').optional(),
      buyPrice: Joi.number().required()
  })
})


module.exports.clientSchema = Joi.object({
  client: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string(),
    phone: Joi.string(),
    nip: Joi.string(),
    balance: Joi.number(),
    totalDebit: Joi.number(),
    totalCredit: Joi.number(),
    route: Joi.string(),
  })
})

module.exports.supplierSchema = Joi.object({
  supplier: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string(),
    phone: Joi.string(),
    nip: Joi.string(),
    balance: Joi.number(),
    totalDebit: Joi.number(),
    totalCredit: Joi.number(),
  })
})