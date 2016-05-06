class Soundrive

  class @Oscillator
    constructor: (options={}) ->
      @options   =
        sampleRate       : 44100
        type             : 'sine'
      @frequency =
        value   : 0
        previous: 0
        target  : 0
        ease    : 0
        phi     : 0
        pDelta  : 0
        delta   : 0
      @amplitude =
        value   : 100 # percent
        previous: 0
        target  : 0
        ease    : 0
        delta   : 0

      for t in ['frequency', 'amplitude']
        for name, value of (options[t] or {})
          @[t][name] = value
        @[t].previous ||= @[t].value
        @[t].target   ||= @[t].value

      @options.sampleRate = options.sampleRate if options.sampleRate

      @sample    = undefined
      @callbacks = {}

    changeFrequency: (frequency) ->
      @frequency.previous = @frequency.value
      @frequency.target   = frequency

    changeAmplitude: (amplitude) ->
      @amplitude.previous = @amplitude.value
      @amplitude.target   = amplitude

    oscillate: (record=true)->
      @sample           = Math.sin(@frequency.phi) * (@amplitude.value / 100)
      @frequency.pDelta = 2 * Math.PI * @frequency.value / @options.sampleRate
      @_increment 'amplitude'
      @_increment 'frequency'
      @frequency.phi   += @frequency.pDelta
      @sample

    isAtTarget: (name) ->
      if @[name].value != @[name].target
        if @[name].previous < @[name].target
          @[name].value >= @[name].target
        else if @[name].previous > @[name].target
          @[name].value <= @[name].target
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
      (@callbacks[name] ||= []).push callback

    trigger: (name, e={}) ->
      f(e) for f in (@callbacks[name] ||= [])

    # private

    _increment: (name, using)->
      unless @isAtTarget(name)
        @[name].delta = ( @[name].target - @[name].previous ) / (@options.sampleRate * @[name].ease)
        @[name].value += @[name].delta
      else
        @[name].value = @[name].target

    _recordSample: (sample) ->
      @sample = sample
      @trigger('oscillate', {sample: @sample})
      sample

if typeof module != 'undefined' and module.exports # if node.js
  module.exports = Soundrive
else if typeof define == 'function' and define.amd # if AMD
  define -> Soundrive
else
  window.Soundrive = Soundrive