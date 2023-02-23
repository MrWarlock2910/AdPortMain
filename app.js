var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var numPeople = 10;

const express = require('express');
const app = express();

function addPeopleSpace() {
  var select = document.getElementById("people");
  var nameInput = document.getElementById("name");
  var name = nameInput.value;
  var option = document.createElement("option");
  option.text = name;
  select.add(option);
  nameInput.value = "";
  numPeople++;
}

// Endpoint to check interview availability
app.post('/check-interview-availability', (req, res) => {
  const { scheduledTime, participants } = req.body;

  // Check if any participant has another interview scheduled at the same time
  const conflictingParticipants = participants.filter(participant => {
    return participant.schedule.some(interview => interview.startTime === scheduledTime);
  });

  // If there are any conflicting participants, throw an error
  if (conflictingParticipants.length > 0) {
    const errorMessage = `The following participants have another interview scheduled at the same time: ${conflictingParticipants.map(p => p.name).join(', ')}`;
    return res.status(400).json({ error: errorMessage });
  }

  // Check if there are at least two participants
  if (participants.length < 2) {
    return res.status(400).json({ error: 'There must be at least two participants' });
  }

  // If all participants are available and there are at least two participants, return success
  return res.status(200).json({ message: 'All participants are available' });
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
