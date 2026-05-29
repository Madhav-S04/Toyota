const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const { verifyToken, isSales } = require("../middleware/auth");

// Protect sales routes with token verification and sales check
router.use(verifyToken, isSales);

// Sales Record Routes
router.get("/car-models", salesController.getCarModels);
router.post("/sales-record", salesController.createOrUpdateSalesRecord);
router.get("/sales-record", salesController.getSalesRecord);
router.post("/calculate-incentive", salesController.calculateIncentivePreview);

module.exports = router;
