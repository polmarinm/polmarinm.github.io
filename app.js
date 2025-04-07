// Initialize state variables
let echoLayers = 2;
let delayTime = 550; // in ms

const minEchoLayers = 1;
const maxEchoLayers = 10;
const minDelayTime = 0;
const maxDelayTime = 3000;
const delayIncrement = 50;

// Get elements by their IDs
const echoDisplay = document.getElementById('echoDisplay');
const echoPlus = document.getElementById('echoPlus');
const echoMinus = document.getElementById('echoMinus');

const delayDisplay = document.getElementById('delayDisplay');
const delayPlus = document.getElementById('delayPlus');
const delayMinus = document.getElementById('delayMinus');

const toggleButton = document.getElementById('toggleButton');

// Update display functions
function updateEchoDisplay() {
  echoDisplay.textContent = echoLayers;
}

function updateDelayDisplay() {
  delayDisplay.textContent = delayTime + 'ms';
}

// Event listeners for echo layers buttons
echoPlus.addEventListener('click', () => {
  if (echoLayers < maxEchoLayers) {
    echoLayers++;
    updateEchoDisplay();
  }
});

echoMinus.addEventListener('click', () => {
  if (echoLayers > minEchoLayers) {
    echoLayers--;
    updateEchoDisplay();
  }
});

// Event listeners for delay time buttons
delayPlus.addEventListener('click', () => {
  if (delayTime < maxDelayTime) {
    delayTime += delayIncrement;
    if (delayTime > maxDelayTime) {
      delayTime = maxDelayTime;
    }
    updateDelayDisplay();
  }
});

delayMinus.addEventListener('click', () => {
  if (delayTime > minDelayTime) {
    delayTime -= delayIncrement;
    if (delayTime < minDelayTime) {
      delayTime = minDelayTime;
    }
    updateDelayDisplay();
  }
});

// Event listener for the Start/Stop toggle button
toggleButton.addEventListener('click', () => {
  if (toggleButton.textContent === 'Start') {
    toggleButton.textContent = 'Stop';
  } else {
    toggleButton.textContent = 'Start';
  }
});
