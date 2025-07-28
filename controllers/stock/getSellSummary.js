const asyncWrapper = require('../../middleware/asyncHandler');
const SellTransaction = require('../../models/sellTransaction');

const getSellSummary = asyncWrapper(async (req, res) => {
    const transactions = await SellTransaction.find({ user: req.user.userId });

    const summaryMap = new Map();

    for (let txn of transactions) {
        const stockKey = txn.stockName || 'Unknown';

        if (!summaryMap.has(stockKey)) {
            summaryMap.set(stockKey, {
                stock: stockKey || 'Unknown',
                totalUnitsSold: 0,
                totalSellAmount: 0,
                totalBuyPrice: 0,
            });
        }

        const item = summaryMap.get(stockKey);
        item.totalUnitsSold += txn.unitsSold;
        item.totalSellAmount += txn.sellingPrice * txn.unitsSold;
        item.totalBuyPrice += txn.buyPrice * txn.unitsSold;
    }

    const summary = [];

    for (let item of summaryMap.values()) {
        const { stock, totalUnitsSold, totalSellAmount, totalBuyPrice } = item;
        const profitOrLossAmount = totalSellAmount - totalBuyPrice;
        const percent = totalBuyPrice ? (profitOrLossAmount / totalBuyPrice) * 100 : 0;

        const entry = {
            stock,
            totalUnitsSold,
            totalSellAmount,
            totalBuyPrice
        };

        if (profitOrLossAmount > 0) {
            entry.profitAmount = Number(profitOrLossAmount.toFixed(2));
            entry.profitPercent = Number(percent.toFixed(2));
        } else if (profitOrLossAmount < 0) {
            entry.lossAmount = Math.abs(Number(profitOrLossAmount.toFixed(2)));
            entry.lossPercent = Math.abs(Number(percent.toFixed(2)));
        } else {
            entry.profitAmount = 0;
            entry.profitPercent = 0;
        }

        summary.push(entry);
    }

    res.status(200).json({
        count: summary.length,
        summary,
    });
});

module.exports = getSellSummary;
