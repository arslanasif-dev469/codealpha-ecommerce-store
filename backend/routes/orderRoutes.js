const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// CREATE ORDER
router.post("/", async (req, res) => {
    try {
        const order = new Order(req.body);

        const savedOrder = await order.save();

        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (error) {
        console.log("ORDER ERROR:");
        console.log(error.message);

        res.status(400).json({
            message: error.message
        });
    }
});


// GET ALL ORDERS
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// UPDATE ORDER STATUS
router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// DELETE ORDER
router.delete("/:id", async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


module.exports = router;