const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");


//For reading files
const fs = require("fs");


jsonAmbitionHeaders = JSON.parse(fs.readFileSync('ambition_headers.json', 'utf8')); 
jsonFirebase = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: jsonFirebase.apiKey,
    authDomain: jsonFirebase.authDomain,
    projectId: jsonFirebase.projectId
  });
  
var db = firebase.firestore();

console.log("Importing " + jsonAmbitionHeaders.length+ " ambition headers");

jsonAmbitionHeaders.forEach(function(obj) {
    try {
        db.collection("AmbitionHeader").doc(obj.id).set({
            ambition: obj.ambition,
            category: obj.category,
            ingress: obj.ingress,
            allowPlusOne: obj.allowPlusOne,
            allowLogAction: obj.allowLogAction
        }) 
        console.log("Added/updated " + obj.id)
    }
    catch (ex){
        console.log("Failed to write document " + ex)
    }
    
});