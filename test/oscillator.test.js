'use strict'

const { assert }   = require('chai'),
        Oscillator = require('../lib/oscillator');

describe('oscillator', function(){
  it('oscillates', function(){
    const oscillator = Oscillator.create({frequency: {value: 12345}}),
          frameSize  = 4096,
          frame      = new Float32Array(frameSize);
    
    let i = 0;

    while (i < frameSize) {
      frame[i] = oscillator.process();
      i++;
    }

    let last;
    assert.isTrue(frame.every(num =>  {
      const result = num !== last;
      last = num;
      return result;
    }));
    assert.isTrue(frame.every(num => !isNaN(num)));
    assert.isTrue(frame[0] === 0); // since the beginning of phase should start with zero
  });
});

