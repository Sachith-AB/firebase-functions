const admin = require("firebase-admin");
const functions = require("firebase-functions");
const {onSchedule} = require("firebase-functions/scheduler");
const {auth} = require("firebase-functions/v1");
const {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  console.log("Hello logs!");
  response.send("Hello from Firebase!");
});

exports.api = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case "GET":
      res.send("GET request received");
      break;
    case "POST":
      res.send(req.body);
      break;
    case "PUT":
      res.send("PUT request received");
      break;
    case "DELETE":
      res.send("DELETE request received");
      break;
    default:
      res.status(405).send("Method Not Allowed");
  }
});

exports.userAdded = auth.user().onCreate((user) => {
  console.log(`User created: ${user.email || "No email"} (UID: ${user.uid})`);
  return Promise.resolve();
});

exports.userDeleted = auth.user().onDelete((user) => {
  console.log(`User deleted: ${user.email || "No email"} (UID: ${user.uid})`);
  return Promise.resolve();
});

exports.addFruits = onDocumentCreated("fruits/{docId}", (event) => {
  const snapshot = event.data;
  const data = snapshot.data();
  console.log(`New fruit: ${data.name} (ID: ${event.params.docId})`);
});

exports.deleteFruits = onDocumentDeleted("fruits/{docId}", (event) => {
  const snapshot = event.data;
  const data = snapshot.data();
  console.log(`delete fruit: ${data.name} (ID: ${event.params.docId})`);
});

exports.updateFruit = onDocumentUpdated("fruits/{docId}", (event) => {
  const snapshot = event.data;
  const beforeData = snapshot.before.data();
  const afterData = snapshot.after.data();
  console.log(`update fruit: ${beforeData.name} to ${afterData.name}`);
});

exports.scheduleFunction = onSchedule(
    {
      schedule: "* * * * *",
    },
    () => {
      console.log("run every one min");
    },
);

