const stockForm = document.getElementById("stockForm");

const result = document.getElementById("result");

const stockHistory = document.getElementById("stockHistory");

const productCount = document.getElementById("productCount");

const totalQuantity = document.getElementById("totalQuantity");

const clearHistory = document.getElementById("clearHistory");


// ==========================================
// LOAD SAVED HISTORY WHEN PAGE OPENS
// ==========================================

window.addEventListener("DOMContentLoaded", loadHistory);


// ==========================================
// LOAD HISTORY FROM BACKEND
// ==========================================

async function loadHistory() {

    try {

        const response = await fetch(
            "/stock-history"
        );

        if (!response.ok) {

            throw new Error(
                "Could not load stock history"
            );

        }

        const data = await response.json();


        // Update dashboard numbers

        productCount.textContent =
            data.length;

        const totalUnits = data.reduce(
            (total, item) => {
                return total + Number(item.quantity);
            },
            0
        );

        totalQuantity.textContent =
            totalUnits;


        // Clear table

        stockHistory.innerHTML = "";


        // If there are no updates

        if (data.length === 0) {

            stockHistory.innerHTML = `
                <tr>
                    <td colspan="4">
                        No stock updates yet
                    </td>
                </tr>
            `;

            return;
        }


        // Display newest updates first

        const newestFirst = [...data].reverse();


        newestFirst.forEach(update => {

            addStockUpdate(
                update.product,
                update.quantity,
                update.timestamp
            );

        });

    } catch (error) {

        console.error(
            "Error loading history:",
            error
        );

        result.textContent =
            "❌ Unable to load stock history.";
    }

}


// ==========================================
// SEND STOCK UPDATE
// ==========================================

stockForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const product =
            document
                .getElementById("product")
                .value
                .trim();


        const quantity =
            Number(
                document
                    .getElementById("quantity")
                    .value
            );


        result.textContent =
            "Sending stock update...";


        try {

            const response =
                await fetch("/webhook", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        product: product,

                        quantity: quantity

                    })

                });


            const data =
                await response.json();


            if (response.ok) {

                result.textContent =
                    `✅ ${data.message}`;


                // Reload history from the backend

                await loadHistory();


                // Clear form

                stockForm.reset();

            } else {

                result.textContent =
                    `❌ ${data.message}`;

            }

        } catch (error) {

            result.textContent =
                "❌ Unable to connect to backend.";

            console.error(error);

        }

    }
);


// ==========================================
// ADD UPDATE TO TABLE
// ==========================================

function addStockUpdate(
    product,
    quantity,
    timestamp
) {

    const row =
        document.createElement("tr");


    // Determine status

    let statusText;

    let statusClass;


    if (Number(quantity) === 0) {

        statusText =
            "Out of Stock";

        statusClass =
            "out-of-stock";

    } else if (Number(quantity) <= 10) {

        statusText =
            "Low Stock";

        statusClass =
            "low-stock";

    } else {

        statusText =
            "In Stock";

        statusClass =
            "in-stock";

    }


    // Format timestamp

    const date =
        new Date(timestamp);


    const time =
        date.toLocaleString([], {

            dateStyle: "short",

            timeStyle: "short"

        });


    // Create row

    row.innerHTML = `

        <td>${product}</td>

        <td>${quantity}</td>

        <td>

            <span class="status ${statusClass}">

                ${statusText}

            </span>

        </td>

        <td>${time}</td>

    `;


    stockHistory.appendChild(row);

}


// ==========================================
// CLEAR HISTORY
// ==========================================

clearHistory.addEventListener(
    "click",
    async function () {

        try {

            const response =
                await fetch(
                    "/stock-history",
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                productCount.textContent =
                    "0";

                totalQuantity.textContent =
                    "0";


                stockHistory.innerHTML = `

                    <tr>

                        <td colspan="4">

                            No stock updates yet

                        </td>

                    </tr>

                `;


                result.textContent =
                    "History cleared.";

            }

        } catch (error) {

            result.textContent =
                "❌ Unable to clear history.";

            console.error(error);

        }

    }
);