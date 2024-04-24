const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    message: {
      type: String,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Message = mongoose.model("Message", conversationSchema);

module.exports = Message;
