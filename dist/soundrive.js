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
        currentFrequency: 0,
        sampleRate: 44100,
        type: 'sine',
        sweepSize: 0,
        phi: 0,
        delta: 0,
        fDelta: 0
      };
      for (option in options) {
        this.values[option] = options[option];
      }
      (base = this.values).previousFrequency || (base.previousFrequency = this.values.currentFrequency);
      (base1 = this.values).targetFrequency || (base1.targetFrequency = this.values.currentFrequency);
      this.sample = void 0;
      this.callbacks = {};
    }

    Oscillator.prototype.changeFrequency = function (frequency) {
      this.values.previousFrequency = this.values.currentFrequency;
      return this.values.targetFrequency = frequency;
    };

    Oscillator.prototype.oscillate = function (record) {
      if (record == null) {
        record = true;
      }
      this.sample = Math.sin(this.values.phi);
      this.values.delta = 2 * Math.PI * this.values.currentFrequency / this.values.sampleRate;
      if (!this.isAtTargetFrequency()) {
        this.values.fDelta = (this.values.targetFrequency - this.values.previousFrequency) / (this.values.sampleRate * this.values.sweepSize);
        this.values.currentFrequency += this.values.fDelta;
      } else {
        this.values.currentFrequency = this.values.targetFrequency;
      }
      this.values.phi += this.values.delta;
      return this.sample;
    };

    Oscillator.prototype.isAtTargetFrequency = function () {
      if (this.values.currentFrequency !== this.values.targetFrequency) {
        if (this.values.previousFrequency < this.values.targetFrequency) {
          return this.values.currentFrequency >= this.values.targetFrequency;
        } else if (this.values.previousFrequency > this.values.targetFrequency) {
          return this.values.currentFrequency <= this.values.targetFrequency;
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