const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const header = req.header("Authorization");

    if (!header) {
        return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;  

        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};
