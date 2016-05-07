class Soundrive

  class @Mixer
    constructor: (options={}) ->
      @options   =
        sampleRate : 44100
        time       : 0
      for name, option of options
        @options[name] = option
      @sources = options.sources or []
    process: ->
      sample = 0
      sourceCount = @sources.length
      for source in @sources
        if source.process
          sample += source.process()
        else if (typeof source) is 'function'
          sample += source()
      sample / sourceCount
    mix: (source) ->
      @sources.push source
      @

    class @Mixable
      constructor: (options={}) ->
        @options   =
          sampleRate : 44100
          time       : 0     # This is just the number of iterations.
        for name, option of options
          @options[name] = option
        @sources = options.sources or []
      mix: (source) ->
        mixer = new Mixer
          sampleRate : @options.sampleRate
          sources    : [@, source]
      on: (name, callback) ->
        ((@callbacks ||= {})[name] ||= []).push callback
      trigger: (name, e={}) ->
        f(e) for f in ((@callbacks ||= {})[name] ||= [])
      process: ->
        @trigger 'process'
        @_incrementTime()

      # private

      _incrementTime: ->
        @options.time++



  class @Oscillator extends @Mixer.Mixable
    constructor: (options={}) ->
      super(options)
      @frequency =
        value   : 0
        previous: 0
        target  : 0
        ease    : 0
        phi     : 0
        pDelta  : 0   # phase delta
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

    changeFrequency: (frequency) ->
      @frequency.previous = @frequency.value
      @frequency.target   = frequency

    changeAmplitude: (amplitude) ->
      @amplitude.previous = @amplitude.value
      @amplitude.target   = amplitude

    process: ->
      @sample           = Math.sin(@frequency.phi) * (@amplitude.value / 100)
      @frequency.pDelta = 2 * Math.PI * @frequency.value / @options.sampleRate
      @_ease 'amplitude'
      @_ease 'frequency'
      @frequency.phi   += @frequency.pDelta
      @trigger 'process', {sample: @sample, oscillator: @}
      @sample

    isAtTarget: (name) ->
      if @[name].value != @[name].target
        if @[name].previous < @[name].target
          @[name].value >= @[name].target
        else if @[name].previous > @[name].target
          @[name].value <= @[name].target
      else
        true

    # private

    _ease: (name, using)->
      unless @isAtTarget(name)
        @[name].delta = ( @[name].target - @[name].previous ) / (@options.sampleRate * @[name].ease)
        @[name].value += @[name].delta
      else
        @[name].value = @[name].target


  class @Processors
    class @Processor extends Soundrive.Mixer
      constructor: (options={}) ->
        super(options)
        @options = 
          influence: 100 # percent
        for name, option of options
          @options[name] = option

      process: ->
        sample = super()
        a = @processor(sample) * (@options.influence / 100)
        b = sample * ((100 - @options.influence) / 100)
        a + b

      processor: (sample) ->
        sample

    class @Triangle extends @Processor
      processor: (sample) ->
        Math.asin(sample) / (Math.PI / 2)

    class @Square extends @Processor
      processor: (sample) ->
        if sample > 0 then 1 else -1

    class @Sawtooth extends @Triangle
      # This will "sawtoothify" the provided
      # waveform.  Because we can't accurately
      # guess the center of the waveform,
      # the result will probably be off-center.
      #
      # Right now, it also creates a right-direcitonal
      # sawtooth but not a reverse sawtooth.  This will
      # be fixed in the future.
      constructor: (options={}) ->
        super(options)
      processor: (sample) ->
        if @previous and sample < @previous
          delta   = @difference sample, @previous
          @sample = (@sample or @previous) + delta
        else
          @sample = sample
        @previous = sample
        (@sample + (@sample * -(2/3)))
      difference: (x, y) ->
        if x > y
          x - y
        else
          y - x

if typeof module != 'undefined' and module.exports # if node.js
  module.exports = Soundrive
else if typeof define == 'function' and define.amd # if AMD
  define -> Soundrive
else
  window.Soundrive = Soundrive