const mongoose = require("mongoose");

const carModelSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
  },
  baseSuffix: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
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

module.exports = mongoose.model("CarModel", carModelSchema);
