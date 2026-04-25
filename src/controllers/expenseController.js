const Joi = require("joi");
const expenseService = require("../services/expenseService");

const expenseSchema = Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    type: Joi.string().valid('Thu', 'Chi').required(),
    category: Joi.string().required()
});

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const searchQuery = req.query.q || ""; 
    const { expenses, income, expense, total } = await expenseService.getUserExpenses(userId, searchQuery);

    res.render("expenses/index", {
      title: "Flow & Fund",
      expenses,
      income,
      expense,
      total,
      searchQuery 
    });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};
//ADD
exports.addExpense = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { error, value } = expenseSchema.validate(req.body);
    if (error) {
        console.log("Lỗi validate:", error.details[0].message);
        return res.redirect("/expenses");
    }

    await expenseService.createExpense(userId, value);
    res.redirect("/expenses");
  } catch (err) {
    console.log(err);
    res.redirect("/expenses");
  }
};
// DELETE
exports.deleteExpense = async (req, res) => {
  try {
    await expenseService.deleteExpense(req.params.id, req.user.userId);
    res.redirect("/expenses");
  } catch (err) {
    console.log(err);
    res.redirect("/expenses");
  }
};
exports.getBudget = (req, res) => {
  res.render("budget/index", {
    title: "Ngân sách của bạn"
  });
};
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { expenses, total } = await expenseService.getUserExpenses(userId);

    res.render("expenses/transactions", {
      title: "Danh sách giao dịch",
      expenses,
      total
    });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
};

