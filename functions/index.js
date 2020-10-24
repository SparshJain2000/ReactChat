const functions = require("firebase-functions");
const Filter = require("bad-words");
const admin = require("firebase-admin");
// const cors = require("cors")({ origin: true });
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const moreBadWords = ["chutia", "loda", "lodu", "gandu", "bc", "bsdk"];
console.log("INSODE");
const db = admin.firestore();
exports.getAllUsers = functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");

    if (req.method === "OPTIONS") {
        // Send response to OPTIONS requests
        res.set("Access-Control-Allow-Methods", "GET");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.set("Access-Control-Max-Age", "3600");
    }
    // res.set("Access-Control-Allow-Credentials", "true");
    admin
        .auth()
        .listUsers()
        .then(function (listUsersResult) {
            console.log(listUsersResult);

            return res.json(listUsersResult.users);

            // listUsersResult.users.forEach(function (userRecord) {
            //     res.json(userRecord.toJSON());
            // });
            // if (listUsersResult.pageToken) {
            //     // List next batch of users.
            //     listAllUsers(listUsersResult.pageToken);
            // }
        })
        .catch(function (error) {
            console.log("Error listing users:", error);
        });
});

exports.detectEvilUsers = functions.firestore
    .document("messages/{msgId}")
    .onCreate(async (doc, ctx) => {
        const filter = new Filter();
        filter.addWords(...moreBadWords);
        const { text, uid } = doc.data();
        if (filter.isProfane(text)) {
            const cleaned = filter.clean(text);
            await doc.ref.update({ text: `cleaned : ${cleaned}` });
            // await db.collection('banned').doc(uid).set({});
        }
    });
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
