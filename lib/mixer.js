'use strict';

const { assign } = Object;

/**
 * Mixes the output of 2 or more Mixable objects.
 * This is used internally by Mixable objects.
 */
class Mixer {
  /**
   * 
   * @param {object} options
   * @param {number} options.sampleRate - The audio sample rate.  Defaults to 44100.
   * @param {number} options.time 
   */
  constructor(options={}) {
    this.options = assign({}, {
      sampleRate: 44100,
      time:       0
    }, options);
    this.sources = options.sources || [];
  }
  /**
   * Combines output samples from sources and returns a mixed sample.
   * @returns {number}
   */
  process() {
    let sample = 0;
    const sources     = this.sources,
          sourceCount = sources.length;
    sources.forEach(source => {
      if (source.process) {
        sample += source.process();
      } else if ((typeof source) === 'function') {
        sample += source();
      }
    });
    return sample / sourceCount;
  }
  /**
   * Adds a Mixable object as a source to be mixed by the process() function.
   * Alternatively, you can pass a function that returns a sample.
   * @param {Mixable|function} source
   */
  mix(source) {
    this.sources.push(source);
    return this;
  }
}

module.exports = Mixer;

