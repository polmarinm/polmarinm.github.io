// State variables
let echoLayers = 1;
let delayTime = 500; // in ms

// Constants for limits
const minEchoLayers = 1;
const maxEchoLayers = 10;
const minDelayTime = 0;
const maxDelayTime = 3000;
const delayIncrement = 50;

// Get UI elements
const echoDisplay = document.getElementById('echoDisplay');
const echoPlus = document.getElementById('echoPlus');
const echoMinus = document.getElementById('echoMinus');

const delayDisplay = document.getElementById('delayDisplay');
const delayPlus = document.getElementById('delayPlus');
const delayMinus = document.getElementById('delayMinus');

const toggleButton = document.getElementById('toggleButton');

// Audio-related variables
let audioContext = null;
let microphoneStream = null;
let mediaStreamSource = null;
let delayNodes = [];

// Update display functions
function updateEchoDisplay() {
  echoDisplay.textContent = echoLayers;
}

function updateDelayDisplay() {
  delayDisplay.textContent = delayTime + 'ms';
}

// Event listeners for echo layers controls
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

// Event listeners for delay time controls
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

// Function to start the echo effect
async function startEffect() {
  // Create the audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Request microphone access
  try {
    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    console.error('Error accessing microphone:', err);
    return;
  }
  
  // Create a source from the microphone
  mediaStreamSource = audioContext.createMediaStreamSource(microphoneStream);
  
  // Build the delay chain.
  // The direct (dry) input is not routed to the destination,
  // only the delayed copies (echoes) will be output.
  let previousNode = mediaStreamSource;
  delayNodes = [];
  
  for (let i = 0; i < echoLayers; i++) {
    // Create a delay node with a maximum delay of 3 seconds.
    const delayNode = audioContext.createDelay(3);
    // Set the delay time (convert ms to seconds)
    delayNode.delayTime.value = delayTime / 1000;
    delayNodes.push(delayNode);
    
    // Connect the previous node to the delay node
    previousNode.connect(delayNode);
    // Route the delayed output to the destination
    delayNode.connect(audioContext.destination);
    
    // For a series connection, the next delay node takes input from this delay node.
    previousNode = delayNode;
  }
}

// Function to stop the echo effect
function stopEffect() {
  if (microphoneStream) {
    // Stop all audio tracks
    microphoneStream.getTracks().forEach(track => track.stop());
    microphoneStream = null;
  }
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

// Toggle Start/Stop button event listener
toggleButton.addEventListener('click', async () => {
  if (toggleButton.textContent === 'Start') {
    toggleButton.textContent = 'Stop';
    await startEffect();
  } else {
    toggleButton.textContent = 'Start';
    stopEffect();
  }
});
