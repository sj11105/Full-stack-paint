const mongoose = require("mongoose");

const SheetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageData: String, // base64 PNG string
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sheet", SheetSchema);
