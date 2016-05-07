Soundrive
==========

Because oscillators in JavaScript shouldn't be *that* hard.

## Preface

So what's wrong with OscillatorNode?  Nothing.

The need for Soundrive came from wanting an oscillator that can smoothly sweep between frequencies while still being easy to use and test both on the browser and server-side.

It's currently in the **alpha** stage, so some things might not work well or at all.  Right now, it only generates sine waves because that's what I most need it for at the moment.  In the future, I want to add more patterns as well as modulators.  I just want to get this up so I can continue my other work as soon as possible, so it's very incomplete.  But feel free to play around with it!

## Installation

`npm install --save soundrive`

Or to install from HEAD:

`npm install --save Ravenstine/soundrive`

## Use

Example use:

```javascript
const Soundrive = require('soundrive');

var oscillator = new Soundrive.Oscillator({frequency: {value: 12345}});

var frameSize = 4096
var frame     = new Float32Array(frameSize)
var i = 0;

while (i < frameSize) {
  frame[i] = oscillator.process();
  i++;
}

```

This would fill up your `frame` with samples for a 12345hz sine wave.

To write to a file on your file system:

```javascript
const fs = require('fs');

var buffer = new Buffer(4096 * 4);

var i = 0;

while (i < frameSize) {
  buffer.writeFloatLE(frame[i], i*4);
  i++;
}

fs.writeFile("./sine.raw", buffer, 'binary', function(err){
  if(err){
    console.log(err);
  }
});
```

This creates a file with raw sample data that you can open up in Audacity through **File > Import**.

The following creates a sweep(i.e. chirp) between two frequencies:

```javascript
var oscillator = new Soundrive.Oscillator({
  frequency: {
    value: 1234,
    ease: 0.5
  }
});

var frameSize = 44100 // one second if that's the sample rate
var frame     = new Float32Array(frameSize)
var i = 0;

oscillator.changeFrequency(2345);

while (i < frameSize) {
  frame[i] = oscillator.process();
  i++;
}
```

The resulting frame of samples will be 1 second with a 0.5 second transition between 1234hz and 2345hz.

### Mix

You can "mix" oscillators together to produce multiple tones.

```javascript
var oscillator1 = new Soundrive.Oscillator({frequency: {value: 770}});
var oscillator2 = new Soundrive.Oscillator({frequency: {value: 852}});

var mix = oscillator1.mix(oscillator1)

var frameSize = 4096
var frame     = new Float32Array(frameSize)
var i = 0;

while (i < frameSize) {
  frame[i] = mix.process()
  i++;
}

```

The mechanism of piping is subject to change, but this is a fundamental feature that I want to have implemented.

## Development

The source is written in CoffeeScript and can be compile to `dist` by running `gulp coffee-src`.