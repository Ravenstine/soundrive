'use strict';

const { asin, PI } = Math,
        Processor  = require('../processor');

/**
 * Turns a sine wave into a triangluar wave.
 * @extends Processor
 */
class Triangle extends Processor {
  processor(sample) {
    return asin(sample) / (PI / 2);
  }
}

module.exports = Triangle;

