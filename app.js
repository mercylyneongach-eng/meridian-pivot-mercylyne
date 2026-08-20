const express = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
    const product = req.body.product;
    const quantity = req.body.quantity;

    if (!product || quantity === undefined) {
        return res.status(400).json({
            message: "Product and quantity are required"
        });
    }

    console.log("Stock update received:");
    console.log("Product:", product);
    console.log("Quantity:", quantity);

    res.status(200).json({
        message: "Stock update received successfully",
        product: product,
        quantity: quantity
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Webhook server is running on port ${PORT}`);
});