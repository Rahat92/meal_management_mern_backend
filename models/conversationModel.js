const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
