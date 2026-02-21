const mongoose = require('mongoose');

const MealsSchema = mongoose.Schema({
    mealDate: Date,
    date: {
        type: String,
        required: [true, "Must have a date"],
    },
    day: {
        type: Number,
        required: [true, "Must have a day"],
    },
    month: {
        type: Number,
        required: [true, "Must have a month"],
    },
    year: {
        type: Number,
        required: [true, "Must have a year"],
    },
    mealManager: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    borders: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            money: Number,
            shop: Number,
            extraShop: Number,
            breakfast: {
                meal: Number,
                status: String,
                updatedBy: {
                    type: mongoose.Schema.ObjectId,
                }
            },
            launch: {
                meal: Number,
                status: String,
                updatedBy: {
                    type: mongoose.Schema.ObjectId,
                }
            },
            dinner: {
                meal: Number,
                status: String,
                updatedBy: {
                    type: mongoose.Schema.ObjectId,
                }
            },
            depositComment:
            {
                comment: [
                    {
                        amount: Number,
                        reason: String,
                        createdAt: {
                            type: Date,
                            default: Date.now
                        }
                    }
                ],
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            },
            shoppingComments:
            {
                comment: [
                    {
                        productName: String,
                        productCount: String,
                        unitPrice: Number,
                        category: mongoose.Schema.Types.ObjectId,
                        tags: [
                            {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: 'ProductsTag'
                            }
                        ],
                        createdAt: {
                            type: Date,
                            default: Date.now
                        }
                    }
                ],
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            },
            extraShoppingComments:
            {
                comment: [
                    {
                        productName: String,
                        productCount: String,
                        unitPrice: Number,
                        category: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'ProductCategory'
                        },
                        tags: [
                            {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: 'ProductsTag'
                            }
                        ],
                        createdAt: {
                            type: Date,
                            default: Date.now
                        }
                    }
                ],
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        }
    ]
})

const MealsModel = mongoose.model('Meals', MealsSchema);
module.exports = MealsModel