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



var currentTime = moment().format("HH:mm");


$("#currentTime").text(currentTime);

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
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var frequency = parseInt($("#frequency").val().trim());

    // do some math for minutes away
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "day");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var minutesAway = frequency - tRemainder;
    var nextTrain = moment().add(minutesAway, "minutes");
    var nextArrival = moment(nextTrain).format("hh:mm");


    // update firebase
    // put entered values into the database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        nextArrival: nextArrival
    });

    // clear out all the inputs
    $("input").val("");

})



// firebase listener to update the view
database.ref().orderByChild("trainName").on("child_added", function(snapshot) {
    var newTrain = snapshot.val();
    console.log("next arrival time: " + newTrain.nextArrival);

    if (newTrain.trainName !== undefined) {
        $("#trainRow").append("<tr class='well'>" + "<td class='trainDisplay'>" + snapshot.val().trainName +
            "</td><td class='destinationDisplay'>" + snapshot.val().destination +
            "</td><td class='firstTrainDisplay'>" + snapshot.val().firstTrainTime +
            "</td><td class='frequencyDisplay'>" + snapshot.val().frequency +
            "</td><td class='nextArrivalDisplay'>" + snapshot.val().nextArrival +
            "</td></tr>");
    }


}, function(errorObject) {
    console.log("errors handled: " + errorObject.code);
});



















