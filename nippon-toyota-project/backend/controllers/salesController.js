const SalesRecord = require("../models/SalesRecord");
const CarModel = require("../models/CarModel");
const IncentiveSlab = require("../models/IncentiveSlab");

const formatSlab = (slab) => ({
  name: slab.slabName,
  range: slab.maxCars === null || slab.maxCars === undefined
    ? `${slab.minCars}+`
    : `${slab.minCars}-${slab.maxCars}`,
  incentivePerCar: slab.incentivePerCar,
});

// Calculate incentive based on total cars sold
const calculateIncentive = async (totalCars) => {
  const slab = await IncentiveSlab.findOne({
    minCars: { $lte: totalCars },
    $or: [
      { maxCars: { $gte: totalCars } },
      { maxCars: null },
      { maxCars: { $exists: false } },
    ],
  });

  if (!slab) {
    return { slab: null, totalIncentive: 0 };
  }

  const totalIncentive = totalCars * slab.incentivePerCar;
  return { slab, totalIncentive };
};

exports.getCarModels = async (req, res) => {
  try {
    const carModels = await CarModel.find().sort({ modelName: 1 });
    res.json(carModels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or get sales record for current month
exports.createOrUpdateSalesRecord = async (req, res) => {
  try {
    const { salesOfficerId } = req.user;
    const { month, carModelSales } = req.body;

    // Calculate total cars
    const totalCars = carModelSales.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate incentive
    const { slab, totalIncentive } = await calculateIncentive(totalCars);

    // Find or create sales record
    const startOfMonth = new Date(month);
    startOfMonth.setDate(1);

    const endOfMonth = new Date(month);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);

    let salesRecord = await SalesRecord.findOne({
      salesOfficerId,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    if (!salesRecord) {
      salesRecord = new SalesRecord({
        salesOfficerId,
        month: startOfMonth,
        carModelSales,
        totalCars,
        totalIncentive,
        applicableSlab: slab ? slab._id : null,
      });
    } else {
      salesRecord.carModelSales = carModelSales;
      salesRecord.totalCars = totalCars;
      salesRecord.totalIncentive = totalIncentive;
      salesRecord.applicableSlab = slab ? slab._id : null;
      salesRecord.updatedAt = Date.now();
    }

    await salesRecord.save();
    await salesRecord.populate("applicableSlab carModelSales.carModelId");

    res.json({
      message: "Sales record saved successfully",
      salesRecord,
      incentiveDetails: {
        totalCars,
        totalIncentive,
        slab: slab ? formatSlab(slab) : null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sales record for current month
exports.getSalesRecord = async (req, res) => {
  try {
    const { salesOfficerId } = req.user;
    const { month } = req.query;

    const startOfMonth = new Date(month);
    startOfMonth.setDate(1);

    const endOfMonth = new Date(month);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);

    const salesRecord = await SalesRecord.findOne({
      salesOfficerId,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    }).populate("applicableSlab carModelSales.carModelId");

    if (!salesRecord) {
      const carModels = await CarModel.find();
      return res.json({
        salesRecord: null,
        carModels,
        message: "No sales record for this month",
      });
    }

    res.json({ salesRecord });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Calculate incentive (real-time)
exports.calculateIncentivePreview = async (req, res) => {
  try {
    const { totalCars } = req.body;

    const { slab, totalIncentive } = await calculateIncentive(totalCars);

    res.json({
      totalCars,
      totalIncentive,
      slab: slab ? formatSlab(slab) : {
        name: "No applicable slab",
        range: "0-0",
        incentivePerCar: 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
