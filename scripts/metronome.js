var metronomeRunning = false;
var bpm = document.getElementById('bpmView').value;
var tempoIndex = 1;
var bpmRepeatingFunction = null;

var bpmSlider = document.getElementById('bpmSlider')
var bpmView = document.getElementById('bpmView')
var metronomeButton = document.getElementById('metronomeButton')
var timeSignatureUpperSelector = document.getElementById("timeSignatureUpper");
var timeSignatureLowerSelector = document.getElementById("timeSignatureLower");

var bpmChangedEvent = new CustomEvent('bpmChanged');
var timeSignatureChangedEvent = new CustomEvent('timeSignatureChanged');
var metronomeToggledEvent = new CustomEvent('metronomeToggled');

var FIRST_BEAT_NOTE_FILE = "res/whole_note.mp3"
var BEAT_NOTE_FILE = "res/beat_note.mp3"

var tempoArray = [
                  new Audio(FIRST_BEAT_NOTE_FILE),
                  new Audio(BEAT_NOTE_FILE),
                  new Audio(BEAT_NOTE_FILE),
                  new Audio(BEAT_NOTE_FILE)
                ]
var timeSignatureUpper = 4; //four per bar
var timeSignatureLower = 4; //quarter notes


bpmView.value = bpm;

function metronomeToggle(){
  metronomeRunning = !metronomeRunning;
  document.dispatchEvent(metronomeToggledEvent)
}

function sliderChanged(){
  bpmView.value = bpmSlider.value;
  document.dispatchEvent(bpmChangedEvent);
}

function valueChanged(){
  bpmSlider.value = bpmView.value;
  document.dispatchEvent(bpmChangedEvent);
}

function updateTimeSignature(){
  timeSignatureUpper = timeSignatureUpperSelector[timeSignatureUpperSelector.selectedIndex].value;
  timeSignatureLower = timeSignatureLowerSelector[timeSignatureLowerSelector.selectedIndex].value;

  var tempoRemainder = tempoArray.length - timeSignatureUpper;

  for(; tempoRemainder > 0; tempoRemainder--){
    tempoArray.pop();
  }
  for(; tempoRemainder < 0; tempoRemainder++){
    tempoArray.push(new Audio(BEAT_NOTE_FILE));
  }
  document.dispatchEvent(timeSignatureChangedEvent)
}

function runMetronome(){
  var visualizationVisible = false;

  if(metronomeRunning){
    var updateInterval = (1000*60*(4/timeSignatureLower))/bpmView.value; //1000 * 60 * 4/timesig * 1/frequency = period in ms
    bpmRepeatingFunction = setInterval(function(e) {
      visualizationVisible = !visualizationVisible;
      tempoArray[tempoIndex].play();
      tempoIndex = (tempoIndex + 1) % tempoArray.length;
    }, updateInterval)
  }
  else {
    clearInterval(bpmRepeatingFunction);
  }
}

document.addEventListener('metronomeToggled', function(e){
  metronomeButton.innerHTML = metronomeRunning ? "Pause metronome" : "Start metronome";
}, false)

document.addEventListener('metronomeToggled', function(e){
  runMetronome()
}, false);

document.addEventListener('bpmChanged', function(e){
  clearInterval(bpmRepeatingFunction);
  runMetronome();
}, false);

document.addEventListener('timeSignatureChanged', function(e){
  clearInterval(bpmRepeatingFunction);
  runMetronome();
}, false);
