const Transaction = require("../models/transaction.model.js");

exports.getUserExpenses = async (userId, searchQuery = "") => {
    let query = { userId: userId };

    if (searchQuery) {
        query.$or = [
            { note: { $regex: searchQuery, $options: "i" } },
            { category: { $regex: searchQuery, $options: "i" } }
        ];
    }

    const transactions = await Transaction.find(query).sort({ date: -1 }); // Sắp xếp theo ngày giao dịch

    let income = 0;
    let expense = 0;

    transactions.forEach(item => {
        if (item.type === "income") { 
            income += item.amount;
        } else {
            expense += item.amount;
        }
    });

    const total = income - expense;
    return { expenses: transactions, income, expense, total };
};

exports.createExpense = async (userId, data) => {
    const transaction = new Transaction({
        userId,
        note: data.name,
        amount: Number(data.amount),
        type: data.type === "Thu" ? "income" : "expense", 
        category: data.category,
        date: new Date()
    });
    return await transaction.save();
};

exports.deleteExpense = async (id, userId) => {
    //kèm theo userId để bảo mật
    return await Transaction.findOneAndDelete({ _id: id, userId: userId });
};