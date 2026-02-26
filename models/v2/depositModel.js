const depositSchema = new mongoose.Schema({
    borderMeal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BorderMeal",
        required: true,
        index: true
    },
    amount: Number,
    reason: String
}, { timestamps: true });

const DepositModel = mongoose.model("Deposit", depositSchema);
module.exports = DepositModel;