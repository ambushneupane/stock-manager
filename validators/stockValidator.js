const Joi=require('joi');

const addStockSchema=Joi.object({
    name:Joi.string().required(),
    price:Joi.number().required().positive(),
    units:Joi.number().integer().positive().required()
});

const updateStockSchema= Joi.object({
    
    name:Joi.string(),
    price:Joi.number().positive(),
    units:Joi.number().integer().positive()
});

const sellStockSchema= Joi.object({
    name:Joi.string().required(),
    sellPrice: Joi.number().positive().required(),
    quantity: Joi.number().integer().positive().required()

})

module.exports={
    addStockSchema,
    updateStockSchema,
    sellStockSchema
}