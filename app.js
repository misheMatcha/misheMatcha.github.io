window.onload = function(){
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
    audio = new Audio("aeriths_theme.mp3")
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

  // player functionality
  function handlePlay(){
    audio.play();
    visualizer();
  }

  function handlePause(){
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
      if(count <= 450){
        if(i % 2 === 0){
          drawVisuals(freq + 3, canX, canY, count += 20, "blue")
          drawVisuals(freq + 3, canX, canY, count += 20, "indigo")
          drawVisuals(freq + 3, canX, canY, count += 20, "violet")
          drawVisuals(freq, canX, canY, count += 20, "red")
        }
      }else{
        drawVisuals(freq, canX, canY, count += 20, "orange")
        drawVisuals(freq, canX, canY, count += 20, "yellow")
        drawVisuals(freq, canX, canY, count += 20, "green")
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

  document.getElementsByClassName("player-container")[0].addEventListener("click", init());
  document.getElementsByClassName("play-btn")[0].addEventListener("click", handlePlay);
  document.getElementsByClassName("pause-btn")[0].addEventListener("click", handlePause);
  document.getElementsByClassName("vol-up-btn")[0].addEventListener("click", volumeUp);
  document.getElementsByClassName("vol-down-btn")[0].addEventListener("click", volumeDown);
}