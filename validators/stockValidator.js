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

module.exports={
    addStockSchema,
    updateStockSchema
}