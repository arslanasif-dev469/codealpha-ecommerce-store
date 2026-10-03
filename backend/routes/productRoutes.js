const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new product
router.post("/", async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// DELETE a product
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully",
            product: deletedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
// UPDATE a product
router.put("/:id", async (req, res) => {

    try {

        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedProduct) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});

// UPDATE PRODUCT STOCK
router.put("/:id/stock", async (req, res) => {

    try {

        const { quantity } = req.body;

        if (quantity === undefined) {

            return res.status(400).json({
                message: "Quantity is required"
            });

        }

        const product =
            await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        if (product.stock < quantity) {

            return res.status(400).json({
                message: "Not enough stock available"
            });

        }

        product.stock -= quantity;

        await product.save();

        res.json({
            message: "Stock updated successfully",
            product: product
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});

module.exports = router;