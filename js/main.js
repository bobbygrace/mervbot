window.AudioContext = window.AudioContext || window.webkitAudioContext
var myBuffer = null;
var context = new AudioContext();

function loadDogSound(url) {
    var request = new XMLHttpRequest();
    request.open("GET", "http://upload.wikimedia.org/wikipedia/commons/8/8a/Bass_drum.ogg", true);
    request.responseType = "arraybuffer";
    request.onload = function() {
    context.decodeAudioData( request.response, 
        function(buffer) { myBuffer = buffer;  } ); }
    request.send();
}

function playSound( buffer ) {
    var sourceNode = context.createBufferSource();
    sourceNode.buffer = myBuffer;
    sourceNode.connect( context.destination );
    sourceNode.start( 0 );
}

playSound()
