const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../helpers/authMiddleware");

router.use(authMiddleware);


router.get("/", expenseController.getExpenses);
router.post("/add", expenseController.addExpense);
router.get("/delete/:id", expenseController.deleteExpense);

router.get("/budget", expenseController.getBudget);
router.get("/transactions", expenseController.getTransactions);

module.exports = router;