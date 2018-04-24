'use strict';

const Mixer = require('./mixer');

/**
 * A processor is a mixer that manipulates a source using the processor() function.
 * Classes such as Sawtooth, Triangle, and Square are sublcasses of Processor.
 * Extend off Processor to create your own.
 */
class Processor extends Mixer {
  static create(){
    return new this(...arguments);
  }
  /**
   * @param {object} options
   * @param {number} options.influence - The percentage of influence to excert on samples.  An influence of zero would leave a sample untouched. 
   */
  constructor(options={}) {
    super(options);
    this.options.influence = this.options.influence || 100;
    for (let name in options) {
      const option = options[name];
      this.options[name] = option;
    }
  }
  /**
   * The function that manipulates a given sample and returns an output sample.
   * The existing function in the class does nothing and is meant to be extended by a subclass.
   * @param {number} sample
   * @returns {number} 
   */
  processor(sample) {
    return sample;
  }

  process() {
    const sample = super.process(),
          a      = this.processor(sample) * (this.options.influence / 100),
          b      = sample * ((100 - this.options.influence) / 100);
    return a + b;
  }

}

module.exports = Processor;

