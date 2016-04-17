var Soundrive;

Soundrive = function () {
  function Soundrive() {}

  Soundrive.Oscillator = function () {
    function Oscillator(options) {
      var base, base1, option;
      if (options == null) {
        options = {};
      }
      this.values = {
        frequency: 0,
        sampleRate: 44100,
        type: 'sine',
        sweep: 0,
        phi: 0,
        delta: 0,
        fDelta: 0,
        amplitude: 100,
        easeIn: 0,
        easeOut: 0
      };
      for (option in options) {
        this.values[option] = options[option];
      }
      (base = this.values).previousFrequency || (base.previousFrequency = this.values.frequency);
      (base1 = this.values).targetFrequency || (base1.targetFrequency = this.values.frequency);
      this.values.sweepIn = this.values.sweep;
      this.values.sweepOut = this.values.sweep;
      this.sample = void 0;
      this.callbacks = {};
    }

    Oscillator.prototype.changeFrequency = function (frequency) {
      this.values.previousFrequency = this.values.frequency;
      return this.values.targetFrequency = frequency;
    };

    Oscillator.prototype.oscillate = function (record) {
      if (record == null) {
        record = true;
      }
      this.sample = Math.sin(this.values.phi) * (this.values.amplitude / 100);
      this.values.delta = 2 * Math.PI * this.values.frequency / this.values.sampleRate;
      this._increment('frequency', 'sweep');
      this.values.phi += this.values.delta;
      return this.sample;
    };

    Oscillator.prototype.isAtTargetFrequency = function () {
      if (this.values.frequency !== this.values.targetFrequency) {
        if (this.values.previousFrequency < this.values.targetFrequency) {
          return this.values.frequency >= this.values.targetFrequency;
        } else if (this.values.previousFrequency > this.values.targetFrequency) {
          return this.values.frequency <= this.values.targetFrequency;
        }
      } else {
        return true;
      }
    };

    Oscillator.prototype.pipe = function (oscillator) {
      var sampleA, sampleB, sampleC;
      sampleA = oscillator.oscillate();
      sampleB = this.oscillate(false);
      sampleC = sampleA / 2 + sampleB / 2;
      this._recordSample(sampleC);
      this.trigger('pipe', {
        sample: sampleC,
        sampleA: sampleA,
        sampleB: sampleB
      });
      return this;
    };

    Oscillator.prototype.on = function (name, callback) {
      var base;
      (base = this.callbacks)[name] || (base[name] = []);
      return this.callbacks[name].push(callback);
    };

    Oscillator.prototype.trigger = function (name, e) {
      var base, f, i, len, ref, results;
      if (e == null) {
        e = {};
      }
      (base = this.callbacks)[name] || (base[name] = []);
      ref = this.callbacks[name];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i];
        results.push(f(e));
      }
      return results;
    };

    Oscillator.prototype._increment = function (name, using) {
      if (!this.isAtTargetFrequency()) {
        this.values.fDelta = (this.values.targetFrequency - this.values.previousFrequency) / (this.values.sampleRate * this.values[using]);
        return this.values[name] += this.values.fDelta;
      } else {
        return this.values[name] = this.values.targetFrequency;
      }
    };

    Oscillator.prototype._capitalize = function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    Oscillator.prototype._recordSample = function (sample) {
      this.sample = sample;
      this.trigger('oscillate', {
        sample: this.sample
      });
      return sample;
    };

    return Oscillator;
  }();

  return Soundrive;
}();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Soundrive;
} else if (typeof define === 'function' && define.amd) {
  define(function () {
    return Soundrive;
  });
} else {
  window.Soundrive = Soundrive;
}