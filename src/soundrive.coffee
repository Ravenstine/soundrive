class Soundrive

  class @Oscillator
    constructor: (options={}) ->
      @values = 
        currentFrequency : 0
        sampleRate       : 44100
        type             : 'sine'
        sweepSize        : 0
        phi              : 0
        delta            : 0
        fDelta           : 0
      for option of options
        @values[option] = options[option]
      @values.previousFrequency ||=  @values.currentFrequency
      @values.targetFrequency   ||=  @values.currentFrequency
      @sample    = undefined
      @callbacks = {}

    changeFrequency: (frequency) ->
      @values.previousFrequency = @values.currentFrequency
      @values.targetFrequency   = frequency

    oscillate: (record=true)->
      @sample          = Math.sin(@values.phi)
      @values.delta    = 2 * Math.PI * @values.currentFrequency / @values.sampleRate
      unless @isAtTargetFrequency()
        @values.fDelta = ( @values.targetFrequency - @values.previousFrequency ) / (@values.sampleRate * @values.sweepSize)
        @values.currentFrequency += @values.fDelta
      else
        @values.currentFrequency = @values.targetFrequency
      @values.phi              += @values.delta
      @sample

    isAtTargetFrequency: ->
      if @values.currentFrequency != @values.targetFrequency
        if @values.previousFrequency < @values.targetFrequency
          @values.currentFrequency >= @values.targetFrequency
        else if @values.previousFrequency > @values.targetFrequency
          @values.currentFrequency <= @values.targetFrequency
      else
        true

    pipe: (oscillator) ->
      sampleA = oscillator.oscillate()
      sampleB = @oscillate(false)
      sampleC = (sampleA / 2) + (sampleB / 2)
      @_recordSample sampleC
      @trigger('pipe', {sample: sampleC, sampleA: sampleA, sampleB: sampleB})
      @

    on: (name, callback) ->
      @callbacks[name] ||= []
      @callbacks[name].push callback

    trigger: (name, e={}) ->
      @callbacks[name] ||= []
      for f in @callbacks[name]
        f(e)

    # private

    _recordSample: (sample) ->
      @sample = sample
      @trigger('oscillate', {sample: @sample})
      sample

if typeof module != 'undefined' and module.exports # if node.js
  module.exports = Soundrive
else if typeof define == 'function' and define.amd # if AMD
  define ->
    Soundrive
else
  window.Soundrive = Soundrive