import * as Tone from 'tone'
import styled from 'styled-components'
import React, { createContext, useReducer, useEffect } from 'react'
import { FLT_FREQ_MAX, FLT_FREQ_MIN, getParams, initialState, reducer } from '../state'

let engine = {
  oscillator1: null,
  oscillator2: null,
  filter: {
    unit: null,
    envelope: null,
  },
  volume: null,
  distortion: null,
  delay: null,
  analyzer: null,
  reverb: null,
}

export const SynthInstrumentContext = createContext([initialState, () => null])

export const Engine = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { initialized } = state
  const params = getParams(state)

  useEffect(() => {
    const { parameters: defaults } = initialState
    const oscillator1 = new Tone.PolySynth()
    const oscillator2 = new Tone.PolySynth()
    const filter = new Tone.Filter(defaults.flt_freq, defaults.flt_type, -24)
    const filterEnvelope = new Tone.Envelope()
    const filterFreqScale = new Tone.Scale(FLT_FREQ_MIN, FLT_FREQ_MAX)
    const distortion = new Tone.Distortion(defaults.dist_amt)
    const delay = new Tone.FeedbackDelay(defaults.delay_time, defaults.delay_feed)
    const volume = new Tone.Volume(defaults.master_vol)
    const reverb = new Tone.Reverb(defaults.verb_time)
    const analyzer = new Tone.Analyser('fft', 128)

    oscillator1.set({ 'oscillator': { 'type': defaults.osc1_type } })
    oscillator2.set({ 'oscillator': { 'type': defaults.osc2_type } })
    distortion.set({ 'oversample': '4x' })
    delay.set({ 'wet': defaults.delay_wet })

    filterEnvelope.connect(filterFreqScale)
    filterFreqScale.connect(filter.frequency)
    oscillator1.connect(delay)
    oscillator2.connect(delay)

    delay.chain(distortion, reverb, filter, analyzer, volume, Tone.Destination)

    engine = {
      oscillator1,
      oscillator2,
      filter: {
        unit: filter,
        scale: filterFreqScale,
        envelope: filterEnvelope,
      },
      volume,
      distortion,
      delay,
      analyzer,
      reverb
    }

    dispatch({ type: 'init_engine' })

    Tone.start()
  }, [])

  useEffect(() => {
    if (!initialized) {
      return
    }

    if (state.analyzer.requesting) {
      dispatch({ type: 'set_analyzer', values: engine.analyzer.getValue() })
    }

  }, [initialized, dispatch, state.analyzer])

  useEffect(() => {
    if (!initialized) {
      return
    }

    const toPlays = state.notes.filter(note => note.isPlaying && !note.triggered)

    const toRelease = state.notes.filter(note => !note.isPlaying)

    const parseFrequencies = (notes) => notes.map(({ note }) => Tone.Midi(note).toFrequency())

    toPlays.forEach(note => {
      engine.oscillator1.triggerAttack(
        Tone.Midi(note.note).toFrequency(), Tone.now(), note.velocity
    )})

    toPlays.forEach(note => engine.oscillator2.triggerAttack(
      Tone.Midi(note.note).toFrequency(), Tone.now(), note.velocity
    ))

    engine.filter.envelope.triggerAttack()

    engine.oscillator1.triggerRelease(parseFrequencies(toRelease))
    engine.oscillator2.triggerRelease(parseFrequencies(toRelease))
    engine.filter.envelope.triggerRelease()

    toPlays.map(({ note }) => dispatch({ type: 'note_triggered', note }))
  }, [state.notes, dispatch, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    const decibels = Tone.gainToDb(params.master_vol)
    engine.volume.set({ 'volume': decibels })
  }, [params.master_vol, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.oscillator1.set({
      'envelope': {
        'attack': params.osc1_env_atk,
        'decay': params.osc1_env_dec,
        'sustain': params.osc1_env_sus,
        'release': params.osc1_env_rel
      }
    })
    engine.oscillator2.set({
      'envelope': {
        'attack': params.osc2_env_atk,
        'decay': params.osc2_env_dec,
        'sustain': params.osc2_env_sus,
        'release': params.osc2_env_rel
      }
    })
  }, [
    params.osc1_env_atk,
    params.osc1_env_dec,
    params.osc1_env_sus,
    params.osc1_env_rel,
    params.osc2_env_atk,
    params.osc2_env_dec,
    params.osc2_env_sus,
    params.osc2_env_rel,
    initialized
  ])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.filter.envelope.set({
      'attack': params.flt_env_atk,
      'decay': params.flt_env_dec,
      'sustain': params.flt_env_sus,
      'release': params.flt_env_rel
    })

  }, [params.flt_env_atk, params.flt_env_dec, params.flt_env_sus, params.flt_env_rel, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.oscillator1.set({ 'oscillator': { 'type': params.osc1_type } })
    engine.oscillator2.set({ 'oscillator': { 'type': params.osc2_type } })
  }, [params.osc1_type, params.osc2_type, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.filter.unit.set({ 'type': params.flt_type })
  }, [params.flt_type, params.flt_freq, params.flt_res, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    if (params.flt_env_mix > 0) {
      engine.filter.scale.min = params.flt_freq
      engine.filter.scale.max = params.flt_freq + (FLT_FREQ_MAX - params.flt_freq) * params.flt_env_mix
    } else {
      engine.filter.scale.min = FLT_FREQ_MIN + (params.flt_freq - FLT_FREQ_MIN) * (1 - Math.abs(params.flt_env_mix))
      engine.filter.scale.max = params.flt_freq
    }

  }, [params.flt_env_mix, params.flt_freq, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.oscillator1.set({ 'oscillator': { 'detune': params.osc1_detune + params.osc1_pitch * 100 } })
    engine.oscillator2.set({ 'oscillator': { 'detune': params.osc2_detune + params.osc2_pitch * 100 } })
  }, [params.osc1_detune, params.osc1_pitch, params.osc2_detune, params.osc2_pitch, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.oscillator1.set({ 'oscillator': { 'volume': Tone.gainToDb(params.osc1_vol) } })
    engine.oscillator2.set({ 'oscillator': { 'volume': Tone.gainToDb(params.osc2_vol) } })
  }, [params.osc1_vol, params.osc2_vol, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.oscillator1.set({ 'oscillator': { 'phase': params.osc1_phase } })
    engine.oscillator2.set({ 'oscillator': { 'phase': params.osc2_phase } })
  }, [params.osc1_phase, params.osc2_phase, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.distortion.set({ 'distortion': params.dist_amt })
  }, [params.dist_amt, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.delay.set({ 'wet': params.delay_wet })
    engine.delay.set({ 'delayTime': params.delay_time })
    engine.delay.set({ 'feedback': params.delay_feed })
  }, [params.delay_wet, params.delay_time, params.delay_feed, initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    engine.reverb.set({ 'wet': params.verb_wet })
    engine.reverb.set({ 'decay': params.verb_time })
  }, [params.verb_wet, params.verb_time, initialized])

  return (
    <Rack>
      <SynthInstrumentContext.Provider value={[state, dispatch]}>
        {initialized ? children : <p>Loading Instrument ...</p>}
      </SynthInstrumentContext.Provider>
    </Rack>
  )
}

const Rack = styled.div`
  overflow: hidden;
  border: 1px solid black;
  padding: 1em;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  box-shadow: inset 0 0 140px rgba(0, 0, 0, 0.2), 0 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`
