'use strict'

const { assert }   = require('chai'),
        Oscillator = require('../../lib/oscillator'),
        Square     = require('../../lib/processors/square');


describe('processors', function(){
  describe('square', function(){
    it('processes a source', function(){
      const oscillator  = Oscillator.create({frequency: {value: 770}}),
            square      = Square.create({sources: [oscillator]}),
            frameSize   = 4096,
            frame       = new Float32Array(frameSize);  

      let i = 0;
  
      while (i < frameSize) {
        frame[i] = square.process();
        i++;
      }
  
      assert.isTrue(frame.reduce((a,b) => { return a + b }, 0) !== 0);
      assert.isTrue(frame.every(num => !isNaN(num)));
    });
  });
});

