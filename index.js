'use strict';

module.exports = {
  Mixable:    require('./lib/mixable'),
  Mixer:      require('./lib/mixer'),
  Oscillator: require('./lib/oscillator'),
  Processor:  require('./lib/processor'),
  processors: {
    Triangle: require('./lib/processors/triangle'),
    Square:   require('./lib/processors/square'),
    Sawtooth: require('./lib/processors/sawtooth')
  }
};

