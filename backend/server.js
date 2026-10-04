require("dotenv").config({ path: __dirname + "/.env" });

console.log("=== SHOP EASE SERVER STARTING ===");
console.log("PORT:", process.env.PORT);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ]
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

// Product Routes
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed!");
        console.log(error.message);
    });

// Home Route
app.get("/", (req, res) => {
    res.send("ShopEase Backend is Running!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
}).on("error", (error) => {
    console.log("SERVER ERROR:", error);
});
process.on("uncaughtException", (error) => {
    console.log("UNCAUGHT EXCEPTION:", error);
});

process.on("unhandledRejection", (error) => {
    console.log("UNHANDLED REJECTION:", error);
});