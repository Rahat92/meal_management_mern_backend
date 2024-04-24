const express = require("express");
const {
  createMeal,
  getMonthMeals,
  updateMeal,
  getBorderMonthlyStats,
  setMyMealStatus,
  updatePersonFullMeal,
  updateMoney,
  updateShopMoney,
  updateExtraShopMoney,
} = require("../controllers/mealCountController");
const { protect, restrictedTo } = require("../controllers/userController");
const router = express.Router();

router.route("/").post(protect, createMeal);
router.route("/:month/:year").get(protect, getMonthMeals);
router
  .route("/monthly-borders-stats/:year/:month/:day")
  .get(protect, getBorderMonthlyStats);
router
  .route("/update-person-full-meal/:id")
  .patch(protect, updatePersonFullMeal);
router.route("/update-my-meal/:id").patch(protect, setMyMealStatus);
router.route("/update-border-money/:id").patch(protect, updateMoney);
router.route("/update-shop-money/:id").patch(protect, updateShopMoney);
router
  .route("/update-extra-shop-money/:id")
  .patch(protect, updateExtraShopMoney);
router.route("/:id").patch(protect, restrictedTo("admin"), updateMeal);
const mealCountRouter = router;
module.exports = mealCountRouter;
