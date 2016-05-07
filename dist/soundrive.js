var Soundrive,
    extend = function (child, parent) {
  for (var key in parent) {
    if (hasProp.call(parent, key)) child[key] = parent[key];
  }function ctor() {
    this.constructor = child;
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
},
    hasProp = {}.hasOwnProperty;

Soundrive = function () {
  function Soundrive() {}

  Soundrive.Mixer = function () {
    function Mixer(options) {
      var name, option;
      if (options == null) {
        options = {};
      }
      this.options = {
        sampleRate: 44100,
        time: 0
      };
      for (name in options) {
        option = options[name];
        this.options[name] = option;
      }
      this.sources = options.sources || [];
    }

    Mixer.prototype.process = function () {
      var i, len, ref, sample, source, sourceCount;
      sample = 0;
      sourceCount = this.sources.length;
      ref = this.sources;
      for (i = 0, len = ref.length; i < len; i++) {
        source = ref[i];
        if (source.process) {
          sample += source.process();
        } else if (typeof source === 'function') {
          sample += source();
        }
      }
      return sample / sourceCount;
    };

    Mixer.prototype.mix = function (source) {
      this.sources.push(source);
      return this;
    };

    Mixer.Mixable = function () {
      function Mixable(options) {
        var name, option;
        if (options == null) {
          options = {};
        }
        this.options = {
          sampleRate: 44100,
          time: 0
        };
        for (name in options) {
          option = options[name];
          this.options[name] = option;
        }
        this.sources = options.sources || [];
      }

      Mixable.prototype.mix = function (source) {
        var mixer;
        return mixer = new Mixer({
          sampleRate: this.options.sampleRate,
          sources: [this, source]
        });
      };

      Mixable.prototype.on = function (name, callback) {
        var base;
        return ((base = this.callbacks || (this.callbacks = {}))[name] || (base[name] = [])).push(callback);
      };

      Mixable.prototype.trigger = function (name, e) {
        var base, f, i, len, ref, results;
        if (e == null) {
          e = {};
        }
        ref = (base = this.callbacks || (this.callbacks = {}))[name] || (base[name] = []);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          f = ref[i];
          results.push(f(e));
        }
        return results;
      };

      Mixable.prototype.process = function () {
        this.trigger('process');
        return this._incrementTime();
      };

      Mixable.prototype._incrementTime = function () {
        return this.options.time++;
      };

      return Mixable;
    }();

    return Mixer;
  }();

  Soundrive.Oscillator = function (superClass) {
    extend(Oscillator, superClass);

    function Oscillator(options) {
      var base, base1, i, len, name, ref, ref1, t, value;
      if (options == null) {
        options = {};
      }
      Oscillator.__super__.constructor.call(this, options);
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
    }

    Oscillator.prototype.changeFrequency = function (frequency) {
      this.frequency.previous = this.frequency.value;
      return this.frequency.target = frequency;
    };

    Oscillator.prototype.changeAmplitude = function (amplitude) {
      this.amplitude.previous = this.amplitude.value;
      return this.amplitude.target = amplitude;
    };

    Oscillator.prototype.process = function () {
      this.sample = Math.sin(this.frequency.phi) * (this.amplitude.value / 100);
      this.frequency.pDelta = 2 * Math.PI * this.frequency.value / this.options.sampleRate;
      this._ease('amplitude');
      this._ease('frequency');
      this.frequency.phi += this.frequency.pDelta;
      this.trigger('process', {
        sample: this.sample,
        oscillator: this
      });
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

    Oscillator.prototype._ease = function (name, using) {
      if (!this.isAtTarget(name)) {
        this[name].delta = (this[name].target - this[name].previous) / (this.options.sampleRate * this[name].ease);
        return this[name].value += this[name].delta;
      } else {
        return this[name].value = this[name].target;
      }
    };

    return Oscillator;
  }(Soundrive.Mixer.Mixable);

  Soundrive.Processors = function () {
    function Processors() {}

    Processors.Processor = function (superClass) {
      extend(Processor, superClass);

      function Processor(options) {
        var name, option;
        if (options == null) {
          options = {};
        }
        Processor.__super__.constructor.call(this, options);
        this.options = {
          influence: 100
        };
        for (name in options) {
          option = options[name];
          this.options[name] = option;
        }
      }

      Processor.prototype.process = function () {
        var a, b, sample;
        sample = Processor.__super__.process.call(this);
        a = this.processor(sample) * (this.options.influence / 100);
        b = sample * ((100 - this.options.influence) / 100);
        return a + b;
      };

      Processor.prototype.processor = function (sample) {
        return sample;
      };

      return Processor;
    }(Soundrive.Mixer);

    Processors.Triangle = function (superClass) {
      extend(Triangle, superClass);

      function Triangle() {
        return Triangle.__super__.constructor.apply(this, arguments);
      }

      Triangle.prototype.processor = function (sample) {
        return Math.asin(sample) / (Math.PI / 2);
      };

      return Triangle;
    }(Processors.Processor);

    Processors.Square = function (superClass) {
      extend(Square, superClass);

      function Square() {
        return Square.__super__.constructor.apply(this, arguments);
      }

      Square.prototype.processor = function (sample) {
        if (sample > 0) {
          return 1;
        } else {
          return -1;
        }
      };

      return Square;
    }(Processors.Processor);

    Processors.Sawtooth = function (superClass) {
      extend(Sawtooth, superClass);

      function Sawtooth(options) {
        if (options == null) {
          options = {};
        }
        Sawtooth.__super__.constructor.call(this, options);
      }

      Sawtooth.prototype.processor = function (sample) {
        var delta;
        if (this.previous && sample < this.previous) {
          delta = this.difference(sample, this.previous);
          this.sample = (this.sample || this.previous) + delta;
        } else {
          this.sample = sample;
        }
        this.previous = sample;
        return this.sample + this.sample * -(2 / 3);
      };

      Sawtooth.prototype.difference = function (x, y) {
        if (x > y) {
          return x - y;
        } else {
          return y - x;
        }
      };

      return Sawtooth;
    }(Processors.Triangle);

    return Processors;
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