const functions = require("firebase-functions");
const Filter = require("bad-words");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const moreBadWords = ["chutia", "loda", "lodu", "gandu", "bc"];
console.log("INSODE");
const db = admin.firestore();
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
