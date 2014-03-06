function MicrophoneSample() {
  this.getMicrophoneInput();
  this.fps = 15;
  this.frameCount = 0;
  this.mouth = document.getElementsByClassName('glyph-mouth');
  this.eyes = document.getElementsByClassName('glyph-eye');
}

MicrophoneSample.prototype.getMicrophoneInput = function() {
  navigator.webkitGetUserMedia({audio: true},
                               this.onStream.bind(this),
                               this.onStreamError.bind(this));
};

MicrophoneSample.prototype.onStream = function(stream) {
  var input = context.createMediaStreamSource(stream);
  var filter = context.createBiquadFilter();
  filter.frequency.value = 120.0;
  filter.type = filter.NOTCH;
  filter.Q = 30.0;

  var analyser = context.createAnalyser();

  // Connect graph.
  input.connect(filter);
  filter.connect(analyser);

  this.analyser = analyser;

  // Setup a timer to visualize some stuff.
  requestAnimFrame(this.visualize.bind(this));

};

MicrophoneSample.prototype.onStreamError = function(e) {
  console.error('Error getting microphone', e);
};

MicrophoneSample.prototype.emoticonEyeMap = [
  "‘",
  "^",
  "⌒",
  "ゥ",
  "ᚗ",
  "ᚚ",
  "(",
  "⚈",
  "❤",
  "♷"
]

MicrophoneSample.prototype.emoticonMouthMap = [
  "‿",
  "﹏ु",
  "ᚂ",
  "☋",
  "☄",
  "つ",
  "…",
  "ᴥ"
]

MicrophoneSample.prototype.applyGlyph = function(elems, map, avg) {
  var rand = Math.random();

  length = map.length;
  idx = Math.floor( avg * length )
  glyph = map[idx];

  for (var i = 0; i < elems.length; i++) {
    elems[i].textContent = glyph;
  };

};

MicrophoneSample.prototype.visualize = function() {
  var freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteFrequencyData(freqByteData);

  var divisions = 2
  var div = Math.floor( freqByteData.length / divisions )

  var eyeAvg = 0;
  var mouthAvg = 0;

  addToSum = function(idx) {
    var value = freqByteData[idx];
    var percent = value / 256;
    return percent;
  };

  for (var i = 0; i < div; i++) {
    eyeAvg = eyeAvg + addToSum(i);
    mouthAvg = mouthAvg + addToSum(i + div);
  };

  eyeAvg = (eyeAvg / div);
  mouthAvg = (mouthAvg / div);

  this.frameCount++;

  // only paint at our determined fps.
  // we'll count frames in ms. when it's greater
  // than the allotted time, then paint.

  if ( ( this.frameCount * 16.6667 ) > ( 1000 / this.fps ) ) {
    this.applyGlyph(this.eyes, this.emoticonEyeMap, eyeAvg);
    this.applyGlyph(this.mouth, this.emoticonMouthMap, mouthAvg);
    this.frameCount = 0;
  }

  requestAnimFrame(this.visualize.bind(this));
  
};

var sample = new MicrophoneSample();
