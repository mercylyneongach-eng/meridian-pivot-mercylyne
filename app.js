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

    res.json(Array.from(attendees.values()));

});


// ==========================================
// CHECK-IN / QR SCAN
// ==========================================

app.post("/check-in", (req, res) => {

    const attendeeId = req.body.attendeeId;

    if (!attendeeId) {

        return res.status(400).json({
            message: "Attendee ID is required"
        });

    }

    const attendee = attendees.get(attendeeId);

    if (!attendee) {

        return res.status(404).json({
            message: "Attendee not found"
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

            message: "Duplicate scan - badge will not be printed again",

            attendee: attendee

        });

    }


    // ======================================
    // CREATE ASYNC PRINT REQUEST
    // ======================================

    const printJobId =
        `JOB-${Date.now()}-${attendeeId}`;


    attendee.status = "Pending";
    attendee.printJobId = printJobId;


    const printRequest = {

        printJobId: printJobId,

        attendeeId: attendeeId,

        status: "Queued",

        createdAt: new Date().toISOString()

    };


    // Publish message to simulated queue
    printQueue.push(printRequest);


    console.log(
        "Print request published to queue:",
        printRequest
    );


    res.status(202).json({

        message: "Check-in accepted. Badge printing is pending.",

        attendee: attendee,

        printJob: printRequest

    });

});


// ==========================================
// VIEW PRINT QUEUE
// ==========================================

app.get("/print-queue", (req, res) => {

    res.json(printQueue);

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


    if (!printJobId || !attendeeId || !status) {

        return res.status(400).json({

            message:
                "printJobId, attendeeId and status are required"

        });

    }


    const attendee = attendees.get(attendeeId);

    if (!attendee) {

        return res.status(404).json({

            message: "Attendee not found"

        });

    }


    // ======================================
    // IGNORE UNKNOWN / OLD JOBS
    // ======================================

    if (attendee.printJobId !== printJobId) {

        return res.status(409).json({

            message:
                "Webhook does not match the attendee's current print job"

        });

    }


    // ======================================
    // SUCCESSFUL PRINT
    // ======================================

    if (status === "completed") {

        attendee.status = "Checked In";


        console.log(

            `Badge printed successfully for ${attendee.name}`

        );


        return res.json({

            message:
                "Print confirmed. Attendee is now checked in.",

            attendee: attendee

        });

    }


    // ======================================
    // FAILED PRINT
    // ======================================

    if (status === "failed") {

        attendee.status = "Not Checked In";


        return res.json({

            message:
                "Badge printing failed. Attendee remains unchecked in.",

            attendee: attendee

        });

    }


    res.status(400).json({

        message: "Unknown print status"

    });

});


// ==========================================
// SIMULATE PRINTER PROCESSING
// ==========================================

app.post("/simulate-printer", (req, res) => {

    const {
        printJobId,
        status = "completed"
    } = req.body;


    const job = printQueue.find(
        item => item.printJobId === printJobId
    );


    if (!job) {

        return res.status(404).json({

            message: "Print job not found"

        });

    }


    job.status = status;


    // Simulate the vendor calling our webhook
    const attendee = attendees.get(job.attendeeId);


    if (attendee) {

        if (status === "completed") {

            attendee.status = "Checked In";

        } else if (status === "failed") {

            attendee.status = "Not Checked In";

        }

    }


    res.json({

        message: "Printer callback simulated successfully",

        printJob: job,

        attendee: attendee

    });

});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Solstice Events check-in service running on port ${PORT}`
    );

});