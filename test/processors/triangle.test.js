'use strict'

const { assert }   = require('chai'),
        Oscillator = require('../../lib/oscillator'),
        Triangle   = require('../../lib/processors/triangle');

describe('processors', function(){
  describe('triangle', function(){
    it('processes a source', function(){
      const oscillator  = Oscillator.create({frequency: {value: 770}}),
            triangle    = Triangle.create({sources: [oscillator]}),
            frameSize   = 4096,
            frame       = new Float32Array(frameSize);  

      let i = 0;
  
      while (i < frameSize) {
        frame[i] = triangle.process();
        i++;
      }
  
      assert.isTrue(frame.reduce((a,b) => { return a + b }, 0) !== 0);
      assert.isTrue(frame.every(num => !isNaN(num)));
      assert.isTrue(frame[0] === 0); // since the beginning of phase should start with zero
    });
  });
});

