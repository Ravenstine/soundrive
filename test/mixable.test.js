'use strict'

const { assert }   = require('chai'),
        Oscillator = require('../lib/oscillator');

// Oscillators are Mixable objects, so that's what we will use to test Mixable.

describe('mixable', function(){
  it('mixes sources', function(){
    const oscillator1 = Oscillator.create({frequency: {value: 770}}),
          oscillator2 = Oscillator.create({frequency: {value: 852}}),
          frameSize   = 4096,
          frame       = new Float32Array(frameSize),
          mix         = oscillator1.mix(oscillator2);

    let i = 0;

    while (i < frameSize) {
      frame[i] = mix.process()
      i++;
    }

    assert.isTrue(frame.reduce((a,b) => { return a + b }, 0) !== 0);
    assert.isTrue(frame.every(num => !isNaN(num)));
    assert.isTrue(frame[0] === 0); // since the beginning of phase should start with zero
  });
});

