const mongoose = require('mongoose');
const yearMonthSchema = new mongoose.Schema({
    year:{
        type:Number
    },
    month:{
        type:Number
    }
})

yearMonthSchema.index({year:1,month:1},{unique:true})
const YearMonthModel = mongoose.model('YearMonth',yearMonthSchema);

module.exports = YearMonthModel;