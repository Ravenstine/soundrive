Soundrive
==========

A simple but flexible audio oscillator for ECMAScript.

## Preface

The need for Soundrive came from wanting an oscillator that can smoothly [sweep](https://en.wikipedia.org/wiki/Chirp) between frequencies while still being easy to use in Node.js and browsers.

To use in the browser, you will probably have to compile it using [Babel](https://babeljs.io/) and/or a tool like [Browserify](http://browserify.org/).

## Installation

`npm install --save soundrive`

Yay!  No dependencies!

## Use

Simplest example:

```javascript
const Soundrive  = require('soundrive'),
      oscillator = Soundrive.Oscillator.create({frequency: {value: 12345}}),
      frameSize  = 4096,
      frame      = new Float32Array(frameSize);

let i = 0;

while (i < frameSize) {
  frame[i] = oscillator.process();
  i++;
}

```

The following creates a sweep(i.e. chirp) between two frequencies:

```javascript
const oscillator = Soundrive.Oscillator.create({
  frequency: {
    value: 1234,
    ease: 0.5
  }
}),

frameSize = 44100, // one second if that's the sample rate
frame     = new Float32Array(frameSize);

let i = 0;

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
const oscillator1 = Soundrive.Oscillator.create({frequency: {value: 770}}),
      oscillator2 = Soundrive.Oscillator.create({frequency: {value: 852}}),
      frameSize   = 4096,
      frame       = new Float32Array(frameSize),
      mix         = oscillator1.mix(oscillator2);

let i = 0;

while (i < frameSize) {
  frame[i] = mix.process()
  i++;
}

```

## Testing

Tests use Mocha.  Use `npm run test` to perform them.

