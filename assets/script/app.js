var trains = [
    "Jake the Dog Train",
    "Thomas the Train",
    "Snowplow Train",
    "Ghost Train",
    "Pikachu Train",
    "Terrifying Clown Train",
    "Bullet Train",
    "Elon Musk's Stupid Train",
    "Abandoned Eurostar Train",
    "WP Ski Train"
]

var config = {
    apiKey: "AIzaSyDtuv_k1jVjs1yQBJb5Dnqe78uPpjNMO3M",
    authDomain: "train-schedule-efc9a.firebaseapp.com",
    databaseURL: "https://train-schedule-efc9a.firebaseio.com",
    projectId: "train-schedule-efc9a",
    storageBucket: "train-schedule-efc9a.appspot.com",
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
console.log("this is working");


var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var minutesAway = 0;

// track trainspotters
var connectionsRef = database.ref("/connections");

// keep track of people watching the trains, because trainspotters
var connectedRef = database.ref(".info/connected");

// when they connect or disconnect
connectedRef.on("value", function(snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true); // keep boolean if connected
        con.onDisconnect().remove(); // remove boolean from firebase if they disconnect
    }
})

connectionsRef.on("value", function(snapshot) {
    var numConn = snapshot.numChildren();

    if (numConn > 2) {
        $("#connected-trainspotters").text((numConn - 1) + " other people are trainspotting.");
    } else if (numConn === 2) {
        $("#connected-trainspotters").text("One other person is trainspotting.");
    } else if (numConn === 1) {
        $("#connected-trainspotters").text("You are the only person trainspotting.");
    }

})

// on click listener
$("#addTrain").on("click", function() {
    event.preventDefault();

    // get inputs
    // define the values that fill these variables
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#firstTrainTime").val().trim();
    frequency = $("#frequency").val().trim();

    // do some math for minutes away
    // next arrival - current time

    // update firebase
    // put entered values into the database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        nextArrival: minutesAway
    });

    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");


    // delete button
    // var deleteBtn = $("<button class='checkbox'>X</button>");
    // deleteBtn.attr("data-remove", trainName);
    // trainName.prepend(deleteBtn);


})

// $(document).on("click", ".checkbox", function() {
//     var trainToRemove = $(this).attr("data-remove");
//     $("#")
// })

// firebase listener to update the view
database.ref().orderByChild("trainName").on("child_added", function(snapshot) {
    var newTrain = snapshot.val();
    console.log(newTrain.trainName);

    $("#trainRow").append("<tr class='well'><td class='trainDisplay'>" + snapshot.val().trainName +
        "</td><td class='destinationDisplay'>" + snapshot.val().destination +
        "</td><td class='firstTrainDisplay'>" + snapshot.val().firstTrainTime +
        "</td><td class='frequencyDisplay'>" + snapshot.val().frequency +
        "</td><td class='nextArrivalDisplay'>" + snapshot.val().nextArrival +
        "</td></tr>");


}, function(errorObject) {
    console.log("errors handled: " + errorObject.code);
});


// child deleted
// database.ref().on("child_removed", function() {
//     var deletedTrain = snapshot.val();
//
// })


















