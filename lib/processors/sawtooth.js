'use strict';

const Processor = require('../processor');

/**
 * This will "sawtoothify" the provided waveform.
 * Because we can't accurately guess the center of the waveform
 * as it comes in, the result will probably be off-center.
 * Right now, it only creates a right-directional sawtooth, 
 * not a reverse sawtooth.  This should be fixed in the future.
 * @extends Processor
 */
class Sawtooth extends Processor {
  processor(sample) {
    if (this.previous && (sample < this.previous)) {
      const delta = difference(sample, this.previous);
      this.sample = (this.sample || this.previous) + delta;
    } else {
      this.sample = sample;
    }
    this.previous = sample;
    debugger
    return (this.sample + (this.sample * -(2/3)));
  }
}

function difference(x, y) {
  if (x > y) return x - y;
  return y - x;
}

module.exports = Sawtooth;

