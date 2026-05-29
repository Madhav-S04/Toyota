const mongoose = require("mongoose");

const salesRecordSchema = new mongoose.Schema({
  salesOfficerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: Date,
    required: true,
  },
  carModelSales: [
    {
      carModelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarModel",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  totalCars: {
    type: Number,
    default: 0,
  },
  totalIncentive: {
    type: Number,
    default: 0,
  },
  applicableSlab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "IncentiveSlab",
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

module.exports = mongoose.model("SalesRecord", salesRecordSchema);
