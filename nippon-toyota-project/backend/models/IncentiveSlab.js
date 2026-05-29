const mongoose = require("mongoose");

const incentiveSlabSchema = new mongoose.Schema({
  slabName: {
    type: String,
    required: true,
  },
  minCars: {
    type: Number,
    required: true,
  },
  maxCars: {
    type: Number,
    default: null,
  },
  incentivePerCar: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("IncentiveSlab", incentiveSlabSchema);
