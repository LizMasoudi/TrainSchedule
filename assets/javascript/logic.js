$(document).ready(function() {
    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyAhIWS2Ta9M49uZuf7LjH-JxwFpv89CR_I",
    authDomain: "trainschedule-50ebd.firebaseapp.com",
    databaseURL: "https://trainschedule-50ebd.firebaseio.com",
    projectId: "trainschedule-50ebd",
    storageBucket: "",
    messagingSenderId: "1093966442227"
    };

    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // Initial Values
    var name = "";
    var destination = "";
    var firstTime = 0;
    var frequency = "";

    // Capture Button Click
    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();

        // Grabbed values from text boxes
        name = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTime = $("#first-time-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // Code for handling the push
        database.ref().push({
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
    database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();

        // Console.loging the last user's data
        // console.log(sv.name);
        // console.log(sv.destination);
        // console.log(sv.firstTime);
        // console.log(sv.frequency);

        var timeFormatted = moment(sv.firstTime, 'HH:mm A').format('hh:mm A');
        // console.log(timeFormatted);

        var train = "09/03/2017" + " " + timeFormatted;
        console.log(train);

        var now = moment();

        var difference = now.diff(moment(train), "minutes");
        var frequencyFormatted = parseInt(sv.frequency);
        // console.log(frequencyFormatted);
        var remainder = difference % frequencyFormatted;
        var minutesRemaining = frequencyFormatted - remainder;

        var nextArrival = moment(now).add(minutesRemaining, 'm');
        var nextArrivalFormatted = moment(nextArrival).format("hh:mm A");
        // console.log(nextArrivalFormatted);

        var minutesAway = moment(nextArrivalFormatted, "hh:mm A").diff(moment(), "minutes"); 
        console.log(minutesAway);
        

        var tableRow = $("<tr>");
        tableRow.append("<td>"+sv.name+"</td>");
        tableRow.append("<td>"+sv.destination+"</td>");
        tableRow.append("<td>"+timeFormatted+"</td>");
        tableRow.append("<td>"+sv.frequency+"</td>");
        tableRow.append("<td>"+nextArrivalFormatted+"</td>");
        tableRow.append("<td>"+minutesAway+"</td>");

        // Change the HTML to reflect
        $("tbody").append(tableRow);

        console.log("_______________________");

        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});