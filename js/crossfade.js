/*
 * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var CrossfadeSample = function() {
  loadSounds(this, {
    bass: 'http://upload.wikimedia.org/wikipedia/commons/8/8a/Bass_drum.ogg',
    hihat: 'http://upload.wikimedia.org/wikipedia/commons/9/95/Hi_hat_closed.ogg',
    hihatopen: 'http://upload.wikimedia.org/wikipedia/commons/3/3d/Hi_hat_open.ogg'
  });
  this.isPlaying = false;
}

CrossfadeSample.prototype.play = function() {
  // Create two sources.
  this.ctl1 = createSource(this.bass);
  this.ctl2 = createSource(this.hihatopen);
  // Mute the second source.
  this.ctl1.gainNode.gain.value = 0;
  // Start playback in a loop
  this.ctl1.source.start(0);
  this.ctl2.source.start(0);
  // Set the initial crossfade to be just source 1.
  this.crossfade(0);

  function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGainNode();
    source.buffer = buffer;
    // Turn on looping
    source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);

    console.log(source);

    return {
      source: source,
      gainNode: gainNode
    };
  }
};

CrossfadeSample.prototype.stop = function() {
  this.ctl1.source.noteOff(0);
  this.ctl2.source.noteOff(0);
};

// Fades between 0 (all source 1) and 1 (all source 2)
CrossfadeSample.prototype.crossfade = function(element) {
  var x = parseInt(element.value) / parseInt(element.max);
  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  this.ctl1.gainNode.gain.value = gain1;
  this.ctl2.gainNode.gain.value = gain2;
};

CrossfadeSample.prototype.toggle = function() {
  this.isPlaying ? this.stop() : this.play();
  this.isPlaying = !this.isPlaying;
};

var sample = new CrossfadeSample();
console.log(sample);
