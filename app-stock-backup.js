const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

// Serve the virtual frontend
app.use(express.static("public"));


// ==========================================
// STORAGE
// ==========================================

const dataFile = path.join(__dirname, "stock-data.json");


// Create storage file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
}


// Read stock data
function readStockData() {

    try {

        const data = fs.readFileSync(
            dataFile,
            "utf8"
        );

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Error reading stock data:",
            error
        );

        return [];
    }
}


// Save stock data
function saveStockData(data) {

    fs.writeFileSync(
        dataFile,
        JSON.stringify(data, null, 2)
    );
}


// ==========================================
// GET STOCK HISTORY
// ==========================================

app.get("/stock-history", (req, res) => {

    const stockData = readStockData();

    res.json(stockData);

});


// ==========================================
// QUERY CURRENT STOCK
// ==========================================

app.get("/stock/:product", (req, res) => {

    const requestedProduct =
        req.params.product;


    const stockData =
        readStockData();


    // Find the most recent update
    const matchingUpdates =
        stockData.filter(item =>
            item.product.toLowerCase() ===
            requestedProduct.toLowerCase()
        );


    // Product does not exist
    if (matchingUpdates.length === 0) {

        return res.status(404).json({

            message: "Product not found",

            product: requestedProduct

        });

    }


    // Get most recent update
    const latestUpdate =
        matchingUpdates[
            matchingUpdates.length - 1
        ];


    // Determine stock status
    let status;


    if (latestUpdate.quantity === 0) {

        status = "Out of Stock";

    } else if (latestUpdate.quantity <= 10) {

        status = "Low Stock";

    } else {

        status = "In Stock";

    }


    res.json({

        product: latestUpdate.product,

        quantity: latestUpdate.quantity,

        status: status,

        timestamp: latestUpdate.timestamp

    });

});


// ==========================================
// WEBHOOK
// ==========================================

app.post("/webhook", (req, res) => {

    const product = req.body.product;

    const quantity = req.body.quantity;


    // Validate product

    if (!product) {

        return res.status(400).json({

            message: "Product is required"

        });

    }


    // Validate quantity

    if (
        quantity === undefined ||
        quantity === null ||
        quantity === "" ||
        Number(quantity) < 0
    ) {

        return res.status(400).json({

            message: "A valid quantity is required"

        });

    }


    const stockUpdate = {

        product: product,

        quantity: Number(quantity),

        timestamp: new Date().toISOString()

    };


    // Read existing data

    const stockData =
        readStockData();


    // Add update

    stockData.push(stockUpdate);


    // Save data

    saveStockData(stockData);


    console.log(
        "Stock update received:"
    );

    console.log(
        "Product:",
        product
    );

    console.log(
        "Quantity:",
        quantity
    );


    res.status(200).json({

        message:
            "Stock update received successfully",

        product: product,

        quantity: Number(quantity),

        timestamp:
            stockUpdate.timestamp

    });

});


// ==========================================
// CLEAR STOCK HISTORY
// ==========================================

app.delete("/stock-history", (req, res) => {

    saveStockData([]);

    res.json({

        message:
            "Stock history cleared successfully"

    });

});


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Webhook server is running on port ${PORT}`
    );

});