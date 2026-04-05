const Record = require("../models/Record");

// CREATE
exports.createRecord = async (req, res) => {
    try {
        const { amount, type, category, date } = req.body;

        console.log("REQ.USER:", req.user); // debug

        const record = new Record({
            amount,
            type,
            category,
            date,
            user: req.user.id   // ✅ FORCE SET
        });

        await record.save();

        console.log("SAVED RECORD:", record); // ✅ verify

        res.json(record);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// READ (with filtering)
exports.getRecords = async (req, res) => {
    const { type, category, startDate, endDate } = req.query;

    let filter = {
        isDeleted: false
    };

    // ✅ ROLE LOGIC
    if (req.user.role !== "admin") {
        filter.user = req.user.id;  // Analyst → only own records
    }

    // ✅ FILTERS
    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    // ✅ POPULATE USER DATA HERE
    const records = await Record.find(filter)
        .populate("user", "name email role");

    res.json(records);
};

// UPDATE
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

// DELETE (soft delete)
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