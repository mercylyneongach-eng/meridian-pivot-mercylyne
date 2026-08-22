const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));


// ==========================================
// ATTENDEE DATA
// ==========================================

const attendees = new Map([
    ["A001", {
        id: "A001",
        name: "Alice Wanjiku",
        status: "Not Checked In",
        printJobId: null
    }],

    ["A002", {
        id: "A002",
        name: "Brian Otieno",
        status: "Not Checked In",
        printJobId: null
    }],

    ["A003", {
        id: "A003",
        name: "Carol Akinyi",
        status: "Not Checked In",
        printJobId: null
    }]
]);


// ==========================================
// SIMULATED MESSAGE QUEUE
// ==========================================

const printQueue = [];


// ==========================================
// GET ALL ATTENDEES
// ==========================================

app.get("/attendees", (req, res) => {

    res.json(
        Array.from(attendees.values())
    );

});


// ==========================================
// CHECK-IN / QR SCAN
// ==========================================

app.post("/check-in", (req, res) => {

    const attendeeId =
        req.body.attendeeId;


    // Validate attendee ID
    if (!attendeeId) {

        return res.status(400).json({

            message:
                "Attendee ID is required"

        });

    }


    // Find attendee
    const attendee =
        attendees.get(attendeeId);


    // Attendee does not exist
    if (!attendee) {

        return res.status(404).json({

            message:
                "Attendee not found"

        });

    }


    // ======================================
    // DUPLICATE SCAN PROTECTION
    // ======================================

    if (
        attendee.status === "Pending" ||
        attendee.status === "Checked In"
    ) {

        return res.status(409).json({

            message:
                "Duplicate scan - badge will not be printed again",

            attendee:
                attendee

        });

    }


    // ======================================
    // CREATE PRINT JOB
    // ======================================

    const printJobId =
        `JOB-${Date.now()}-${attendeeId}`;


    // Change state to Pending
    attendee.status =
        "Pending";


    // Store current print job
    attendee.printJobId =
        printJobId;


    // Create message
    const printRequest = {

        printJobId:
            printJobId,

        attendeeId:
            attendeeId,

        status:
            "Queued",

        createdAt:
            new Date().toISOString()

    };


    // ======================================
    // PUBLISH TO MESSAGE QUEUE
    // ======================================

    printQueue.push(
        printRequest
    );


    console.log(
        "Print request published to queue:",
        printRequest
    );


    // ======================================
    // RETURN PENDING RESPONSE
    // ======================================

    return res.status(202).json({

        message:
            "Check-in accepted. Badge printing is pending.",

        attendee:
            attendee,

        printJob:
            printRequest

    });

});


// ==========================================
// VIEW PRINT QUEUE
// ==========================================

app.get("/print-queue", (req, res) => {

    res.json(
        printQueue
    );

});


// ==========================================
// PRINTER WEBHOOK
// ==========================================

app.post("/printer-webhook", (req, res) => {

    const {
        printJobId,
        attendeeId,
        status
    } = req.body;


    // ======================================
    // VALIDATE WEBHOOK
    // ======================================

    if (
        !printJobId ||
        !attendeeId ||
        !status
    ) {

        return res.status(400).json({

            message:
                "printJobId, attendeeId and status are required"

        });

    }


    // Find attendee
    const attendee =
        attendees.get(attendeeId);


    if (!attendee) {

        return res.status(404).json({

            message:
                "Attendee not found"

        });

    }


    // ======================================
    // OUT-OF-ORDER / OLD JOB PROTECTION
    // ======================================

    if (
        attendee.printJobId !== printJobId
    ) {

        return res.status(409).json({

            message:
                "Webhook does not match the attendee's current print job"

        });

    }


    // ======================================
    // PRINT COMPLETED
    // ======================================

    if (
        status === "completed"
    ) {

        attendee.status =
            "Checked In";


        // Update queue record
        const job =
            printQueue.find(
                item =>
                    item.printJobId ===
                    printJobId
            );


        if (job) {

            job.status =
                "completed";

            job.completedAt =
                new Date().toISOString();

        }


        console.log(
            `Badge printed successfully for ${attendee.name}`
        );


        return res.json({

            message:
                "Print confirmed. Attendee is now checked in.",

            attendee:
                attendee

        });

    }


    // ======================================
    // PRINT FAILED
    // ======================================

    if (
        status === "failed"
    ) {

        attendee.status =
            "Not Checked In";


        const job =
            printQueue.find(
                item =>
                    item.printJobId ===
                    printJobId
            );


        if (job) {

            job.status =
                "failed";

            job.completedAt =
                new Date().toISOString();

        }


        return res.json({

            message:
                "Badge printing failed. Attendee remains unchecked in.",

            attendee:
                attendee

        });

    }


    // ======================================
    // UNKNOWN STATUS
    // ======================================

    return res.status(400).json({

        message:
            "Unknown print status"

    });

});


// ==========================================
// SIMULATE PRINTER
// ==========================================

app.post("/simulate-printer", (req, res) => {

    const {
        printJobId,
        status = "completed"
    } = req.body;


    // Find print job
    const job =
        printQueue.find(
            item =>
                item.printJobId ===
                printJobId
        );


    if (!job) {

        return res.status(404).json({

            message:
                "Print job not found"

        });

    }


    // ======================================
    // SEND CALLBACK THROUGH WEBHOOK
    // ======================================

    const attendee =
        attendees.get(
            job.attendeeId
        );


    if (!attendee) {

        return res.status(404).json({

            message:
                "Attendee not found"

        });

    }


    // Simulate vendor callback
    attendee.status =
        status === "completed"
            ? "Checked In"
            : "Not Checked In";


    job.status =
        status;


    res.json({

        message:
            "Printer callback simulated successfully",

        printJob:
            job,

        attendee:
            attendee

    });

});


// ==========================================
// RESET DEMO DATA
// ==========================================

app.post("/reset-demo", (req, res) => {

    attendees.forEach(
        attendee => {

            attendee.status =
                "Not Checked In";

            attendee.printJobId =
                null;

        }
    );


    // Clear message queue
    printQueue.length =
        0;


    console.log(
        "Demo data reset successfully"
    );


    res.json({

        message:
            "Demo data reset successfully",

        attendees:
            Array.from(
                attendees.values()
            )

    });

});


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    () => {

        console.log(
            `Solstice Events check-in service running on port ${PORT}`
        );

    }
);