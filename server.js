require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected");

        app.listen(PORT, () => {
            console.log(`Server running`);
        });
    })
    .catch((err) => {
        console.log("DB Connection Failed:", err);
    });
