const Stock = require('../../models/stock.js');
const asyncWrapper = require('../../middleware/asyncHandler.js');
const { BadRequestError } = require('../../errors/index.js');
const { addStockSchema } = require('../../validators/stockValidator.js');

const addStock = asyncWrapper(async (req, res) => {
    const body = req.body || {};
    const { error, value } = addStockSchema.validate(body);

    if (error) {
        throw new BadRequestError(error.details[0].message);
    }

    const { name, price, units } = value;
    const upperCaseName = name.toUpperCase();

    const existing = await Stock.findOne({
        name: upperCaseName,
        user: req.user.userId
    });

    const numericPrice = Number(parseFloat(price).toFixed(2));
    const numericUnits = Number(units);

    if (existing) {
        const totalUnits = existing.units + numericUnits;

        
        const totalCost = (existing.price * existing.units) + (numericPrice * numericUnits);
        const updatedPrice = totalCost / totalUnits;

        existing.units = totalUnits;
        existing.price = Number(updatedPrice.toFixed(2));
        await existing.save();

        return res.status(200).json({
            msg: 'Stock updated successfully',
            stock: existing
        });
    }

    const newStock = await Stock.create({
        name: upperCaseName,
        price: numericPrice,
        units: numericUnits,
        user: req.user.userId
    });

    res.status(201).json({
        msg: 'Stock added successfully',
        stock: newStock
    });
});

module.exports = addStock;
