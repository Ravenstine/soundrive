var Soundrive;

Soundrive = function () {
  function Soundrive() {}

  Soundrive.Oscillator = function () {
    function Oscillator(options) {
      var base, base1, i, len, name, ref, ref1, t, value;
      if (options == null) {
        options = {};
      }
      this.options = {
        sampleRate: 44100,
        type: 'sine'
      };
      this.frequency = {
        value: 0,
        previous: 0,
        target: 0,
        ease: 0,
        phi: 0,
        pDelta: 0,
        delta: 0
      };
      this.amplitude = {
        value: 100,
        previous: 0,
        target: 0,
        ease: 0,
        delta: 0
      };
      ref = ['frequency', 'amplitude'];
      for (i = 0, len = ref.length; i < len; i++) {
        t = ref[i];
        ref1 = options[t] || {};
        for (name in ref1) {
          value = ref1[name];
          this[t][name] = value;
        }
        (base = this[t]).previous || (base.previous = this[t].value);
        (base1 = this[t]).target || (base1.target = this[t].value);
      }
      if (options.sampleRate) {
        this.options.sampleRate = options.sampleRate;
      }
      this.sample = void 0;
      this.callbacks = {};
    }

    Oscillator.prototype.changeFrequency = function (frequency) {
      this.frequency.previous = this.frequency.value;
      return this.frequency.target = frequency;
    };

    Oscillator.prototype.changeAmplitude = function (amplitude) {
      this.amplitude.previous = this.amplitude.value;
      return this.amplitude.target = amplitude;
    };

    Oscillator.prototype.oscillate = function (record) {
      if (record == null) {
        record = true;
      }
      this.sample = Math.sin(this.frequency.phi) * (this.amplitude.value / 100);
      this.frequency.pDelta = 2 * Math.PI * this.frequency.value / this.options.sampleRate;
      this._increment('amplitude');
      this._increment('frequency');
      this.frequency.phi += this.frequency.pDelta;
      return this.sample;
    };

    Oscillator.prototype.isAtTarget = function (name) {
      if (this[name].value !== this[name].target) {
        if (this[name].previous < this[name].target) {
          return this[name].value >= this[name].target;
        } else if (this[name].previous > this[name].target) {
          return this[name].value <= this[name].target;
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
      return ((base = this.callbacks)[name] || (base[name] = [])).push(callback);
    };

    Oscillator.prototype.trigger = function (name, e) {
      var base, f, i, len, ref, results;
      if (e == null) {
        e = {};
      }
      ref = (base = this.callbacks)[name] || (base[name] = []);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i];
        results.push(f(e));
      }
      return results;
    };

    Oscillator.prototype._increment = function (name, using) {
      if (!this.isAtTarget(name)) {
        this[name].delta = (this[name].target - this[name].previous) / (this.options.sampleRate * this[name].ease);
        return this[name].value += this[name].delta;
      } else {
        return this[name].value = this[name].target;
      }
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