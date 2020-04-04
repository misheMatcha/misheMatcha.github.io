window.onload = function(){
  // Audio
  var analyser,
      audio,
      audioCtx,
      canvas,
      canvasCtx,
      buffer,
      dataArray,
      freq,
      source;

  function init(){
    audioSetup();
    canvasSetup();
    dataSetup();
    audio.volume = .3
  }
  
  function audioSetup(){
    audio = new Audio("/audio_sensory/src/aeriths_theme.mp3")
    audioCtx = audioCtx || new AudioContext();
    analyser = analyser || audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  
  function canvasSetup(){
    canvas = document.getElementById("canvas");
    canvasCtx = canvas.getContext("2d");
    canvas.width = 750;
    canvas.height = 750;
  }
  
  function dataSetup(){
    buffer = analyser.frequencyBinCount;
    dataArray = new Uint8Array(buffer);
  }

  // Player functionality
  function handlePlay(){
    if(audioCtx.state === 'suspended'){
      audioCtx.resume().then(() => {
        console.log('resume context')
      })
    }
    audio.play();
    visualizer();
  }

  function handlePause(){
    if(audioCtx.state === 'running'){
      audioCtx.suspend().then(() => {
        console.log('suspend context')
      })
    }
    audio.pause();
  }

  function volumeUp(){
    if(audio.volume < 1){
      audio.volume += .1;
    }
  }
  
  function volumeDown(){
    if(audio.volume > 0){
      audio.volume -= .1;
    }
  }
  
  function visualizer(){
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    analyser.getByteTimeDomainData(dataArray);
    var count = 100;

    for(var i = 0; i < dataArray.length; i++){
      freq = dataArray[i];
      var canX = canvas.width/2;
      var canY = canvas.height/2;
      if(count <= 500){
        if(i % 2 === 0){
          drawVisuals(freq + 11, canX, canY, count += 10, "white")
          drawVisuals(freq + 13, canX, canY, count += 13, "yellow")
        }else{
          drawVisuals(freq + 12, canX, canY, count += 10, "orange")
          drawVisuals(freq + 15, canX, canY, count += 5, "purple")

        }
      }
    }
    requestAnimationFrame(visualizer);
  }
  
  function drawVisuals(freq, x, y, size, color){
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, Math.abs(freq-size), 0, Math.PI*2);
    canvasCtx.strokeStyle = color;
    canvasCtx.lineWidth = 1;
    canvasCtx.stroke()
  }

  // Modal
  var modal = document.getElementById("modal-wrap");
  var modalButton = document.getElementById("modal-button");
  modalButton.onclick = function () {
    modal.style.display = "none";
    init();
  }
  
  document.getElementsByClassName("play-button")[0].addEventListener("click", handlePlay);
  document.getElementsByClassName("pause-button")[0].addEventListener("click", handlePause);
  document.getElementsByClassName("vol-up-button")[0].addEventListener("click", volumeUp);
  document.getElementsByClassName("vol-down-button")[0].addEventListener("click", volumeDown);
}