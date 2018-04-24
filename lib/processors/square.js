'use strict';

const Processor = require('../processor');

/**
 * Turns a sine wave into a square/rectangular wave.
 * @extends Processor
 */
class Square extends Processor {
  processor(sample) {
    return (sample > 0) ? 1 : -1
  }
}

module.exports = Square;

