# Assignment 1: Solo Recon – Learning & Blocker Journal

Learner: Mercylyne Ongach  
Project: Meridian Pivot – Northstar Retail Co.  
Unfamiliar Tool: Webhooks  
Programming Environment: Node.js / JavaScript  
Repository: meridian-pivot-mercylyne  

---

# 1. Learning Objective

The objective of this assignment was to independently learn an unfamiliar technology and build a small working prototype.

My assigned unfamiliar technology was *webhooks*.

My goal was to understand how webhooks work and how they can allow one application to automatically send information to another application when an event occurs.

I aimed to learn how to:

- Explain what a webhook is.
- Understand the difference between polling and webhooks.
- Create a basic webhook endpoint.
- Receive data through a webhook request.
- Process the information received.
- Test the webhook.
- Troubleshoot problems independently.
- Document my learning process and blockers.

---

# 2. Starting Knowledge

Before starting this assignment, I had basic computer knowledge and some familiarity with VS Code, Git, GitHub, and Node.js.

I knew that Node.js could be used to run JavaScript outside of a browser, but I had little practical experience using Node.js to build an application.

Webhooks were unfamiliar to me. I had not previously built a webhook or worked with a webhook endpoint.

I understood generally that applications can communicate with each other, but I did not initially understand how webhooks allow one application to automatically send information to another application.

---

# 3. Learning Plan

I planned to approach the unfamiliar technology by:

1. Learning the basic concept of webhooks.
2. Understanding how webhooks differ from polling.
3. Learning how a Node.js application can receive a webhook.
4. Setting up a small Node.js project.
5. Building a simple webhook prototype.
6. Testing the prototype.
7. Recording errors and blockers as they occurred.
8. Investigating and resolving problems independently.
9. Documenting the final result and lessons learned.

---

# 4. Day 1 – Project Setup

## 4.1 Creating the Individual Repository

I created a new GitHub repository specifically for the Meridian Pivot assignment rather than using the repository from the previous Northstar assignment.

The repository was created as a **public repository** so that the instructor can access the submitted link.

Repository name:

`meridian-pivot-mercylyne`

The repository contains:

- README.md
- Node.js `.gitignore`

### What I learned

I learned that a GitHub repository is a separate project space where code and documentation can be stored and tracked.

I also learned that a `.gitignore` file is important in a Node.js project because it prevents files and folders such as `node_modules` from unnecessarily being uploaded to GitHub.

---

# 5. Connecting the Repository to My Computer

I cloned the new GitHub repository to my computer and opened it in VS Code.

Initially, I accidentally had an outer folder and an inner repository folder.

The folder structure was initially:

```text
Desktop
└── meridian-pivot-mercylyne
    └── meridian-pivot-mercylyne6. Checking the Development Environment

I checked whether Node.js was installed by running:

node --version

The result was:

v24.19.0

This confirmed that Node.js was installed and working.

I then checked npm.

When I initially ran:

npm --version

PowerShell returned an execution policy error indicating that:

npm.ps1 cannot be loaded because running scripts is disabled on this system.
Blocker – PowerShell npm Execution Policy
Problem

The normal npm command could not run because PowerShell was blocking the npm.ps1 script.

Investigation

I identified that the problem was related to PowerShell's handling of the npm PowerShell script rather than Node.js itself.

Solution

Instead of changing Windows security settings, I used:

npm.cmd --version

This successfully returned:

11.17.0
What I learned

I learned that Node.js and npm can be installed correctly even when PowerShell prevents the normal npm command from running.

I also learned that npm.cmd can be used in PowerShell when the PowerShell script wrapper is blocked.

7. Creating the Node.js Project

After confirming that Node.js was working, I initialized the project using:

npm.cmd init -y

This created:

package.json

I learned that package.json contains information about a Node.js project and its dependencies.

At one point, I accidentally typed:

package.json

into the terminal as if it were a command.

PowerShell returned an error because the file name itself is not a terminal command.

What I learned

This helped me understand the difference between a project file and a terminal command.

8. Installing Express

I installed Express using:

npm.cmd install express

This created or updated:

node_modules/
package.json
package-lock.json

The project contained:

.gitignore
README.md
package.json
package-lock.json
node_modules/
What I learned

I learned that Express is a Node.js framework that can help create web applications and endpoints.

I also learned that npm can be used to install packages that provide additional functionality to a Node.js project.

9. Creating the Application File

I created an app.js file for the webhook application.

Initially, I accidentally created the file on my Desktop instead of inside the GitHub repository.

I identified the problem by checking the project directory and noticing that app.js was not inside the repository.

I then moved the file into the correct project directory.

The file is now located inside:

meridian-pivot-mercylyne/

The project structure is:

meridian-pivot-mercylyne/
│
├── app.js
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── node_modules/
What I learned

I learned that files need to be created inside the correct project/repository folder so that they can be included in the project and tracked by Git.

I also learned how to check the location of files using PowerShell.

10. My Understanding of Webhooks

From my initial learning, I understand a webhook as a way for systems to communicate by automatically sending information when a particular event occurs.

I related this to online shopping.

For example, after placing an order, a customer may receive updates such as:

The order has been received.
The order is being packaged.
The order has been handed to a shipping company.
The order has left a particular location.
The order has arrived at a pickup station.
The order has been successfully delivered.

I understand that the webhook itself is not necessarily the message that the customer sees. Instead, it can be the mechanism that allows different systems to send information to each other, which can then result in an update being displayed to the customer.

For the Meridian Pivot project, I understand that a warehouse could use a webhook to notify our application when stock changes instead of our application repeatedly asking the warehouse for the current stock.

11. Technical Understanding of Webhooks

I learned that a webhook is triggered by an event.

In the Meridian Pivot example, the event could be a change in the quantity of a product in the warehouse.

When the event occurs, the warehouse system can send an HTTP request to a specific endpoint in our application.

The endpoint acts as an address where the application is prepared to receive the information.

The information can be sent in JSON format.

For example:

{
  "product": "Laptop",
  "quantity": 22
}

I learned that the HTTP POST method can be used to send this information to the webhook endpoint.

The basic flow I understand is:

Event occurs
      ↓
Warehouse sends POST request
      ↓
Webhook endpoint receives request
      ↓
Node.js processes the information
12. First Webhook Implementation

I started creating my webhook prototype using Node.js and Express.

I imported Express into my application and created an Express application.

I then added JSON parsing so that the application could understand JSON data sent in webhook requests.

I created a POST endpoint called:

/webhook

The endpoint was designed to receive incoming webhook information and return a response.

13. Blocker 1 – Node.js Could Not Find app.js
Problem

When I tried to start my Node.js application using:

node app.js

I received a MODULE_NOT_FOUND error saying that Node.js could not find app.js.

Error
Error: Cannot find module
'C:\Users\mercy\Desktop\meridian-pivot-mercylyne\app.js'
Investigation

I compared the folder shown in my terminal with the actual location of app.js.

I discovered that I was working from the wrong directory. My terminal was in the outer folder while app.js was inside the inner repository folder.

Solution

I moved into the correct project directory using:

cd .\meridian-pivot-mercylyne

I then checked the directory to confirm that app.js was present.

What I learned

I learned that Node.js looks for the file in the directory where the terminal is currently located.

I also learned that I need to make sure my terminal is inside the correct project/repository folder before running Node.js files.

14. Starting the Webhook Server

After correcting the directory problem, I ran:

node app.js

The application started successfully.

The server was configured to run on port:

3000

The webhook endpoint was:

http://localhost:3000/webhook

At this stage, I had successfully started the webhook server and was ready to test sending data to the endpoint.

15. Blocker 2 – Incorrect PowerShell Command Input
Problem

When I tried to send a test webhook request, PowerShell returned an error.

What happened

I accidentally included the PowerShell prompt (PS C:\...>) as part of the command instead of entering only the command itself.

PowerShell interpreted part of the folder path as part of the command and returned a parameter error.

Investigation

I checked the command I entered and noticed that I had copied the terminal prompt together with the Invoke-RestMethod command.

Solution

I moved into the correct project directory and entered only the command itself.

What I learned

I learned that the PS C:\...> text displayed in PowerShell is the command prompt and should not be copied when entering a command.

16. Successful Webhook Test

After starting the Node.js server, I tested the webhook by sending a POST request.

The test sent the following JSON data:

{
  "product": "Laptop",
  "quantity": 25
}

The webhook successfully received the request and returned a successful response.

The Node.js application also displayed the received information in the terminal.

Test Result

Expected result:
The webhook should receive the stock information and return a successful response.

Actual result:
The webhook successfully received the Laptop and quantity information and returned a successful response.

Status: PASS

What I Learned

I learned how a webhook endpoint can receive information through an HTTP POST request.

I also learned that JSON can be used to send structured information such as a product name and quantity.

This was my first successful test of a webhook and helped me connect the theoretical concept of webhooks with an actual working Node.js application.

17. Blocker 3 – Missing app.listen()
Problem

At one point, running:

node app.js

returned me to the PowerShell prompt without keeping the server running.

Investigation

I checked the contents of app.js using:

Get-Content .\app.js

I discovered that the section that tells the Express application to listen for requests was missing.

Solution

I added:

const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Webhook server is running on port ${PORT}`);
});

I then restarted the application.

The server successfully displayed:

Webhook server is running on port 3000
What I learned

I learned that defining an Express route is not enough to keep the server running.

The application must use app.listen() to listen for incoming requests on a specific port.

18. Blocker 4 – Incomplete Data Was Accepted

After successfully testing a valid webhook request, I deliberately tested what would happen if the quantity was missing.

I sent:

{
  "product": "Laptop"
}

The application initially accepted the request even though the quantity was missing.

The quantity was displayed as:

undefined
Problem Identified

The webhook was accepting incomplete stock information.

For an inventory system, this could result in incorrect or incomplete stock data being processed.

Investigation

I reviewed the code and identified that there was no validation checking whether the required information had been provided.

19. Improvement – Adding Data Validation

I added validation to the webhook endpoint.

The validation checks whether both the product and quantity have been provided.

The validation I added was:

if (!product || quantity === undefined) {
    return res.status(400).json({
        message: "Product and quantity are required"
    });
}

I then tested the webhook again using:

{
  "product": "Laptop"
}

This time, the request was rejected with:

Product and quantity are required
Result

PASS

The validation worked successfully.

What I Learned

I learned that a webhook should not automatically trust the information it receives.

The application needs to check that required information is present before processing it.

I also learned that an HTTP 400 response can be used to indicate that a request contains invalid or incomplete information.

20. Final Validation Test – Valid Stock Update

After adding validation, I tested the webhook again using valid data.

Data Sent
{
  "product": "Laptop",
  "quantity": 25
}
Result

The webhook accepted the request successfully and returned:

Stock update received successfully

The server also displayed:

Product: Laptop
Quantity: 25
Status

PASS

This confirmed that adding validation did not break valid requests.

21. Final Prototype Status

The webhook mini-prototype is now working successfully.

The prototype can:

Start a Node.js/Express server.
Provide a /webhook endpoint.
Receive POST requests.
Receive JSON data.
Extract product information.
Extract quantity information.
Validate required information.
Reject incomplete requests.
Return a successful response for valid requests.

The current flow is:

Warehouse/System
       ↓
HTTP POST request
       ↓
/webhook endpoint
       ↓
Node.js + Express
       ↓
Validate information
       ↓
 ┌───────────────┐
 │               │
Invalid         Valid
 │               │
 ↓               ↓
HTTP 400       Process data
 │               │
 ↓               ↓
Reject          Success
22. Key Learning Outcomes

Through this exercise I learned:

What a webhook is and how it can be used for system-to-system communication.
How webhooks differ conceptually from repeatedly polling for information.
How Node.js can be used to run a JavaScript application.
How Express can be used to create an HTTP endpoint.
How a POST request can send JSON data.
How an Express application can read data from a request.
How app.listen() starts a server and keeps it listening for requests.
How validation can prevent incomplete information from being processed.
How HTTP 400 responses can be used for invalid requests.
How to troubleshoot problems by checking the terminal, project files, folder location, and application code.
23. Reflection

At the beginning of the assignment, webhooks were unfamiliar to me and I had limited practical experience building a Node.js application.

I initially found it difficult to understand how the different parts connected. I also encountered several practical problems involving the project folder, PowerShell commands, starting the server, and validating incoming data.

Instead of relying on someone else to fix these problems, I investigated the errors, checked my files and terminal location, tested different solutions, and corrected the problems.

The biggest lesson for me was that programming involves troubleshooting as much as writing code. An error does not necessarily mean that the whole project has failed. It can provide information about what needs to be checked or changed.

I also learned that testing different situations is important. My first successful webhook test showed that valid data could be received, but testing incomplete data revealed that my application needed validation.

24. Final Outcome

The individual mini-prototype was completed successfully.

The prototype demonstrates a basic webhook receiving stock information through a POST request using Node.js and Express.

It also demonstrates basic validation by rejecting requests where required information is missing.

Final status: COMPLETE

Prototype: Working
Webhook endpoint: Working
Valid data test: PASS
Invalid data test: PASS
Validation: Working
Troubleshooting documented: Yes

Day 2 Summary 

Today, I extended my Meridian Pivot webhook prototype by adding a virtual frontend using HTML, CSS, and JavaScript and connecting it to my Node.js/Express backend. I encountered a “Cannot GET /” error and learned how to serve the frontend using express.static("public"). I also experienced backend connection issues and learned how to troubleshoot the Node.js process and restart the server when Ctrl+C did not work.

I added persistent storage using stock-data.json, allowing inventory updates to remain available after refreshing the dashboard. When the history initially disappeared after refreshing, I checked the JSON file to confirm that the data was being saved and then fixed the frontend so it loads the saved history from the backend.

I also created and tested a GET /stock/:product endpoint, which allows the system to return the latest quantity and stock status for a product. I tested the webhook and inventory endpoint directly using PowerShell.

Finally, I committed my changes to GitHub and pushed them to the main branch. Render successfully detected the changes and deployed the updated version.

Final outcome: I successfully transformed my basic webhook prototype into a functional Meridian Pivot inventory MVP with a virtual frontend, backend API, persistent storage, stock history, stock status, inventory querying, GitHub version control, and Render deployment.


Meridian Pivot Event – Asynchronous Event Check-In
Pivot Context

The original prototype focused on learning webhooks and building a Node.js and Express application. During the Meridian Pivot Simulation, the client requirement changed. The original synchronous badge-printer API was being deprecated, so the check-in service could no longer wait for an immediate printer response.

The new requirement was to use an asynchronous architecture where the kiosk publishes a badge-print request to a message queue and waits for the printer vendor to send a webhook confirmation when the badge has actually been printed.

Original Approach

The original client workflow was synchronous:

QR code scan → Call printer API → Wait for response → Show "Checked In"

This approach was no longer suitable because the vendor was deprecating the synchronous printing API.

New Pivot Approach

I redesigned the check-in flow to use an asynchronous model:

QR code scan → Create print request → Queue request → Show "Pending" → Receive printer webhook → Show "Checked In"

The application now separates the initial check-in request from the final confirmation that the badge has been printed.

Technologies Used
Node.js
Express.js
JavaScript
HTML/CSS
REST-style endpoints
Webhooks
Simulated message queue
Git and GitHub
Implementation Work

I adapted the existing Node.js and Express project instead of creating a separate repository.

The backend was redesigned to include:

An attendee data structure containing three test attendees.
A /check-in endpoint for processing QR-code scans.
A simulated print-message queue.
A /print-queue endpoint for viewing queued print requests.
A /printer-webhook endpoint for receiving printer completion callbacks.
A Pending state so an attendee is not immediately marked as checked in.
A Checked In state that is only reached after printer confirmation.
Duplicate-scan protection.
Print-job ID validation to prevent an old or incorrect webhook from changing an attendee's status.
A /reset-demo endpoint for resetting the test environment.
Frontend Changes

I replaced the original inventory dashboard interface with a Solstice Events check-in kiosk interface.

The new interface allows staff to:

Select an attendee to simulate a QR-code scan.
Submit a check-in request.
See the Pending state while the badge is being printed.
Simulate the printer webhook confirmation.
See Checked In only after the print confirmation.
Receive a duplicate-scan message when an attendee has already been checked in.
Testing Performed

I tested the system using three attendees:

A001 – Alice Wanjiku
A002 – Brian Otieno
A003 – Carol Akinyi
Test 1 – Normal asynchronous check-in

A001 was scanned successfully.

The system returned a pending response and changed the attendee status to Pending.

After the simulated printer webhook confirmed that the badge was printed, A001 changed to Checked In.

This confirmed that the application does not mark an attendee as checked in before the printer confirmation is received.

Test 2 – Multiple attendees

A002 and A003 were both scanned and placed into the Pending state.

Both print requests were assigned unique print-job IDs.

Test 3 – Out-of-order confirmations

A003's printer confirmation was deliberately received before A002's confirmation even though A002 was scanned first.

A003 changed to Checked In while A002 remained Pending.

A002 was then confirmed separately and changed to Checked In.

This demonstrated that the system does not depend on webhook confirmations arriving in the same order as the original scans.

Test 4 – Duplicate scan

After A001 had already been checked in, I scanned A001 again.

The system returned a conflict response with the message:

"Duplicate scan - badge will not be printed again."

A001 remained Checked In, and a second print request was not created.

This confirmed that duplicate badge printing is prevented.

Blockers Encountered and Solutions
Blocker 1 – Stopping the Node.js server

I initially could not stop the running Node.js server using Ctrl+C.

I solved this by opening another PowerShell window, navigating to the project directory, checking the running Node process, and using:

Stop-Process -Name node -Force

This allowed me to restart the application with the updated code.

Blocker 2 – Incorrect print-job ID during webhook testing

I initially attempted to send the printer webhook using placeholder values such as REPLACE_WITH_JOB_ID and YOUR_JOB_ID.

The application correctly rejected these requests because the webhook job ID did not match the attendee's current print job.

I resolved this by querying the /attendees endpoint, retrieving the actual printJobId, and using that ID in the webhook request.

This also helped me understand why unique job identifiers are important for asynchronous systems.

Blocker 3 – Existing inventory frontend

The original frontend was an inventory dashboard and did not match the new Solstice Events requirements.

I adapted the existing frontend into an event check-in kiosk instead of creating a completely separate project.

Key Learning Areas

The pivot helped me understand that asynchronous systems cannot assume that a request will immediately produce its final result.

I learned the importance of:

Separating request acceptance from completion.
Representing intermediate states such as Pending.
Using unique job IDs to track asynchronous work.
Using webhooks for completion notifications.
Protecting systems against duplicate requests.
Handling callbacks that arrive out of order.
Updating the user interface based on backend state.
Testing both successful and failure/duplicate scenarios.
Adapting an existing project when client requirements change.
Final Outcome

The final prototype successfully demonstrates an asynchronous event check-in service for Solstice Events Co.

The system accepts QR-code check-ins, places badge-print requests into a simulated message queue, displays a Pending state, receives printer completion through a webhook, and only then changes the attendee to Checked In.

The system also prevents duplicate badge printing and correctly handles printer confirmations arriving out of order.

The prototype was tested with three attendees and successfully demonstrated the required client scenarios.

