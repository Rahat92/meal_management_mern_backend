const mongoose = require('mongoose');
const yearMonthSchema = new mongoose.Schema({
    year:{
        type:Number
    },
    month:{
        type:Number
    },
    manager: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: ['Must have a manager']
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

yearMonthSchema.index({year:1,month:1, manager:1},{unique:true})
const YearMonthModel = mongoose.model('YearMonth',yearMonthSchema);

module.exports = YearMonthModel;