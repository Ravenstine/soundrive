class Soundrive

  class @Oscillator
    constructor: (options={}) ->
      @values =
        frequency        : 0
        sampleRate       : 44100
        type             : 'sine'
        sweep            : 0
        phi              : 0
        delta            : 0
        fDelta           : 0
        amplitude        : 100 # percent
        easeIn           : 0
        easeOut          : 0
      for option of options
        @values[option] = options[option]
      @values.previousFrequency ||=  @values.frequency
      @values.targetFrequency   ||=  @values.frequency
      @values.sweepIn  = @values.sweep
      @values.sweepOut = @values.sweep
      @sample    = undefined
      @callbacks = {}

    changeFrequency: (frequency) ->
      @values.previousFrequency = @values.frequency
      @values.targetFrequency   = frequency

    oscillate: (record=true)->
      @sample          = Math.sin(@values.phi) * (@values.amplitude / 100)
      @values.delta    = 2 * Math.PI * @values.frequency / @values.sampleRate
      @_increment 'frequency', 'sweep'
      @values.phi              += @values.delta
      @sample

    isAtTargetFrequency: ->
      if @values.frequency != @values.targetFrequency
        if @values.previousFrequency < @values.targetFrequency
          @values.frequency >= @values.targetFrequency
        else if @values.previousFrequency > @values.targetFrequency
          @values.frequency <= @values.targetFrequency
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

    _increment: (name, using)->
      unless @isAtTargetFrequency()
        @values.fDelta = ( @values.targetFrequency - @values.previousFrequency ) / (@values.sampleRate * @values[using])
        @values[name] += @values.fDelta
      else
        @values[name] = @values.targetFrequency

    _capitalize: (string) ->
      string.charAt(0).toUpperCase() + string.slice(1)

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
