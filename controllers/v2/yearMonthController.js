const MealMonthModel = require("../../models/v2/mealMonthModel");
const YearMonthModel = require("../../models/yearMonthModel")

exports.getAdminYearMonths = async (req, res) => {
    const manager = req.query.managerId;
    console.log('manager ', manager)
    const find = {}
    if (manager !== 'null' || manager !== 'undefined') {
        find.mealManager = manager;
    }
    console.log(find)
    const yearMonth = await MealMonthModel.find(find)
    console.log(yearMonth)
    res.status(200).json({
        status: 'Success',
        result: yearMonth
    })
}