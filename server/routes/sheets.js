const express = require("express");
const Sheet = require("../models/sheet");
const router = express.Router();

router.post("/save", async (req, res) => {
  const { userId, imageData } = req.body;

  const newSheet = new Sheet({ userId, imageData });
  await newSheet.save();

  res.json({ success: true, message: "Sheet saved!" });
});

router.get("/get/:userId", async (req, res) => {
  const sheets = await Sheet.find({ userId: req.params.userId });
  res.json({ success: true, sheets });
});

module.exports = router;
