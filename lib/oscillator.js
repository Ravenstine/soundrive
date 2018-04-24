'use strict';

const Mixable  = require('./mixable'),
    { assign } = Object;

/**
 * An audio oscillator that supports chirps/sweeps.
 */
class Oscillator extends Mixable {
  /**
   * @param {object} options
   * @param {object} options.frequency        - Frequency options
   * @param {number} options.frequency.value  - The current frequency.
   * @param {number} options.frequency.target - A target frequency to sweep to.
   * @param {number} options.frequency.ease   - The number of samples to sweep frequency by.
   * @param {object} options.amplitude        - Amplitude options
   * @param {number} options.amplitude.value  - The current amplitude.
   * @param {number} options.amplitude.target - A target amplitude to sweep to.
   * @param {number} options.amplitude.ease   - The number of samples to sweep amplitude by.
   */
  constructor(options={}) {
    super();
    this.frequency = assign({
      value   : 0,
      previous: 0,
      target  : 0,
      ease    : 0,
      phi     : 0,
      pDelta  : 0,   // phase delta
      delta   : 0
    }, options.frequency);
    this.amplitude = assign({
      value   : 100, // percent
      previous: 0,
      target  : 0,
      ease    : 0,
      delta   : 0
    }, options.amplitude);

    ['frequency', 'amplitude'].forEach(t => {
      const settings = this[t];
      if (!settings.previous) settings.previous = settings.value;
      if (!settings.target)   settings.target   = settings.value;
    });

    if (options.sampleRate) this.options.sampleRate = options.sampleRate;
  }
  /**
   * Sets a new target frequency.
   * @param {number} frequency - The frequency to target.
   */
  changeFrequency(frequency) {
    this.frequency.previous = this.frequency.value;
    return this.frequency.target = frequency;
  }
  /**
   * Sets a new target amplitude.
   * @param {number} amplitude - The amplitude target.
   */
  changeAmplitude(amplitude) {
    this.amplitude.previous = this.amplitude.value;
    return this.amplitude.target = amplitude;
  }
  /**
   * Performs an oscillation and returns a resulting sample.
   * @returns {number}
   */
  process() {
    this.sample           = Math.sin(this.frequency.phi) * (this.amplitude.value / 100);
    this.frequency.pDelta = (2 * Math.PI * this.frequency.value) / this.options.sampleRate;
    this._ease('amplitude');
    this._ease('frequency');
    this.frequency.phi   += this.frequency.pDelta;
    this.emit('process', {sample: this.sample, oscillator: this});
    return this.sample;
  }

  _isAtTarget(name) {
    if (this[name].value === this[name].target)  return true;
    if (this[name].previous < this[name].target) return this[name].value >= this[name].target;
    if (this[name].previous > this[name].target) return this[name].value <= this[name].target;
  }

  _ease(name){
    if (this._isAtTarget(name)) return this[name].value = this[name].target;
    this[name].delta = ( this[name].target - this[name].previous ) / (this.options.sampleRate * this[name].ease);
    return this[name].value += this[name].delta;
  }
}

module.exports = Oscillator;

