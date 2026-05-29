const CarModel = require("../models/CarModel");
const IncentiveSlab = require("../models/IncentiveSlab");

const normalizeSlabInput = ({ slabName, minCars, maxCars, incentivePerCar }) => ({
  slabName,
  minCars: Number(minCars),
  maxCars: maxCars === "" || maxCars === null || maxCars === undefined
    ? null
    : Number(maxCars),
  incentivePerCar: Number(incentivePerCar),
});

// CAR MODEL MANAGEMENT
exports.addCarModel = async (req, res) => {
  try {
    const { modelName, baseSuffix, variant } = req.body;

    const carModel = new CarModel({
      modelName,
      baseSuffix,
      variant,
    });

    await carModel.save();
    res.status(201).json({
      message: "Car model added successfully",
      carModel,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCarModels = async (req, res) => {
  try {
    const carModels = await CarModel.find();
    res.json(carModels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCarModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { modelName, baseSuffix, variant } = req.body;

    const carModel = await CarModel.findByIdAndUpdate(
      id,
      {
        modelName,
        baseSuffix,
        variant,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!carModel) {
      return res.status(404).json({ message: "Car model not found" });
    }

    res.json({
      message: "Car model updated successfully",
      carModel,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCarModel = async (req, res) => {
  try {
    const { id } = req.params;

    const carModel = await CarModel.findByIdAndDelete(id);

    if (!carModel) {
      return res.status(404).json({ message: "Car model not found" });
    }

    res.json({ message: "Car model deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// INCENTIVE SLAB MANAGEMENT
exports.addIncentiveSlab = async (req, res) => {
  try {
    const slabData = normalizeSlabInput(req.body);

    if (
      Number.isNaN(slabData.minCars) ||
      Number.isNaN(slabData.incentivePerCar) ||
      (slabData.maxCars !== null && Number.isNaN(slabData.maxCars))
    ) {
      return res.status(400).json({ message: "Invalid slab values" });
    }

    if (slabData.maxCars !== null && slabData.maxCars < slabData.minCars) {
      return res.status(400).json({ message: "Maximum cars must be greater than minimum cars" });
    }

    const slab = new IncentiveSlab(slabData);

    await slab.save();
    res.status(201).json({
      message: "Incentive slab added successfully",
      slab,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllIncentiveSlabs = async (req, res) => {
  try {
    const slabs = await IncentiveSlab.find().sort({ minCars: 1 });
    res.json(slabs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateIncentiveSlab = async (req, res) => {
  try {
    const { id } = req.params;
    const slabData = normalizeSlabInput(req.body);

    if (
      Number.isNaN(slabData.minCars) ||
      Number.isNaN(slabData.incentivePerCar) ||
      (slabData.maxCars !== null && Number.isNaN(slabData.maxCars))
    ) {
      return res.status(400).json({ message: "Invalid slab values" });
    }

    if (slabData.maxCars !== null && slabData.maxCars < slabData.minCars) {
      return res.status(400).json({ message: "Maximum cars must be greater than minimum cars" });
    }

    const slab = await IncentiveSlab.findByIdAndUpdate(
      id,
      {
        ...slabData,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!slab) {
      return res.status(404).json({ message: "Incentive slab not found" });
    }

    res.json({
      message: "Incentive slab updated successfully",
      slab,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteIncentiveSlab = async (req, res) => {
  try {
    const { id } = req.params;

    const slab = await IncentiveSlab.findByIdAndDelete(id);

    if (!slab) {
      return res.status(404).json({ message: "Incentive slab not found" });
    }

    res.json({ message: "Incentive slab deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
