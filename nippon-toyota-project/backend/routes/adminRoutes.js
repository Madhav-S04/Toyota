const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Protect all routes with token verification and admin check
router.use(verifyToken, isAdmin);

// Car Model Routes
router.post("/car-models", adminController.addCarModel);
router.get("/car-models", adminController.getAllCarModels);
router.put("/car-models/:id", adminController.updateCarModel);
router.delete("/car-models/:id", adminController.deleteCarModel);

// Incentive Slab Routes
router.post("/incentive-slabs", adminController.addIncentiveSlab);
router.get("/incentive-slabs", adminController.getAllIncentiveSlabs);
router.put("/incentive-slabs/:id", adminController.updateIncentiveSlab);
router.delete("/incentive-slabs/:id", adminController.deleteIncentiveSlab);

module.exports = router;
