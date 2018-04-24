'use strict';

const { assign }     = Object,
        EventEmitter = require('events'),
        Mixer        = require('./mixer');

/**
 * An audio source that can be mixed with other sources.
 */
class Mixable extends EventEmitter {
  static create(){
    return new this(...arguments);
  }
  /**
   * 
   * @param {object} options
   * @param {number} sampleRate - The sample rate for the mixable object.  Defaults to 44100.
   * @param {number} time 
   */
  constructor(options={}) {
    super();
    this.options = assign({}, {
      sampleRate: 44100,
      time:       0
    }, options);
    this.sources = options.sources || [];
  }
  /**
   * Creates a new mixer that combines the current mixable object with another mixable object.
   * @param {Mixable} source - The source mixeable object to form a new mixer with.
   * @returns {Mixer} 
   */
  mix(source) {
    return new Mixer({
      sampleRate : this.options.sampleRate,
      sources    : [this, source]
    });
  }
  process() {
    this.emit('process');
    return this._incrementTime();
  }
  _incrementTime() {
    return this.options.time++;
  }
}

module.exports = Mixable;

