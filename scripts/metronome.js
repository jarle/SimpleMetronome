var metronomeRunning = false;
var bpm = document.getElementById('bpmSlider').value;
var visualComponent = null;

var bpmSlider = document.getElementById('bpmSlider')
var bpmView = document.getElementById('bpmView')
var metronomeButton = document.getElementById('metronomeButton')
var metronomeVisualizer = document.getElementById('metronomeVisualizer')

var bpmChanged = new CustomEvent('bpmChanged');
var metronomeToggledEvent = new CustomEvent('metronomeToggled');

bpmView.value = bpm;
metronomeVisualizer.style.visibility = "hidden";

function metronomeToggle(){
  metronomeRunning = !metronomeRunning;
  document.dispatchEvent(metronomeToggledEvent)
}

function sliderChanged(){
  bpmView.value = bpmSlider.value;
  document.dispatchEvent(bpmChanged);
}

function valueChanged(){
  bpmSlider.value = bpmView.value;
  document.dispatchEvent(bpmChanged);
}

function runMetronome(){
  var visualizationVisible = false;

  if(metronomeRunning){
    var updateInterval = 1000*(60/(2*bpmView.value));
    visualComponent = setInterval(function(e) {
      visualizationVisible = !visualizationVisible;
      metronomeVisualizer.style.visibility = visualizationVisible ? "hidden" : "visible";
    }, updateInterval)
  }
  else {
    clearInterval(visualComponent);
    metronomeVisualizer.style.visibility = "hidden";
    console.log("wtf");
  }
}

document.addEventListener('metronomeToggled', function(e){
  metronomeButton.innerHTML = metronomeRunning ? "Pause metronome" : "Start metronome";
}, false)

document.addEventListener('metronomeToggled', function(e){
  runMetronome()
}, false);

document.addEventListener('bpmChanged', function(e){
  clearInterval(visualComponent);
  runMetronome();
}, false);
