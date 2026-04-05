const Record = require("../models/Record");
exports.summary = async (req, res) => {
    try {
        let filter = { isDeleted: false };

        if (req.user.role !== "admin") {
            filter.user = req.user.id;
        }

        const records = await Record.find(filter).populate("user", "name email");

        let income = 0, expense = 0;

        records.forEach(r => {
            if (r.type === "income") income += r.amount;
            else expense += r.amount;
        });

        let userSummary = {};

        if (req.user.role === "admin") {
            records.forEach(r => {
                const userId = r.user._id;

                if (!userSummary[userId]) {
                    userSummary[userId] = {
                        name: r.user.name,
                        email: r.user.email,
                        income: 0,
                        expense: 0
                    };
                }

                if (r.type === "income") userSummary[userId].income += r.amount;
                else userSummary[userId].expense += r.amount;
            });
        }

        res.json({
            totalIncome: income,
            totalExpense: expense,
            netBalance: income - expense,
            userSummary: Object.values(userSummary)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
