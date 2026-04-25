const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  category: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    enum: ["income", "expense"]
  },
  amount: Number,
  note: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);