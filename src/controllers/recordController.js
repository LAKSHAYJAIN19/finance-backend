const Record = require("../models/Record");
exports.createRecord = async (req, res) => {
    try {
        const { amount, type, category, date } = req.body;

        console.log("REQ.USER:", req.user); 

        const record = new Record({
            amount,
            type,
            category,
            date,
            user: req.user.id  
        });

        await record.save();

        res.json(record);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getRecords = async (req, res) => {
    const { type, category, startDate, endDate } = req.query;

    let filter = {
        isDeleted: false
    };

    if (req.user.role !== "admin") {
        filter.user = req.user.id;  
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const records = await Record.find(filter)
        .populate("user", "name email role");

    res.json(records);
};

exports.updateRecord = async (req, res) => {
    const record = await Record.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: "after" }
    );

    if (!record) {
        return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
};

exports.deleteRecord = async (req, res) => {
    const record = await Record.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
    );

    if (!record) {
        return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Deleted successfully" });
};
