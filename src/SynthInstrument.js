import Tone from 'tone'
import React, { createContext, useReducer, useEffect } from 'react'
import { append, ifElse, find, when, assoc, propEq, map, compose, filter, both } from 'ramda'

const initialState = {
  notes: [],
  instrument: null,
  volume: 1,
  waveshape: 'sawtooth',
  pingPongDelay: {
    engine: null,
    wet: 1,
    delayTime: 0.2,
    feedback: 0.3,
  },
}

const reducer = (state = initialState, action) => {
  if (!action) {
    return state
  }

  switch(action.type) {
    case 'init_instrument':
      return { ...state, instrument: action.instrument }
    case 'note_pressed':
      return {
        ...state,
        notes: ifElse(
          find(propEq('note', action.note)),
          map(when(
            propEq('note', action.note),
            compose(assoc('isPlaying', true), assoc('triggered', false)),
          )),
          append({ note: action.note, isPlaying: true, triggered: false }),
        ) (state.notes),
      }
    case 'note_triggered':
      return {
        ...state,
        notes: map(when(
          propEq('note', action.note),
          assoc('triggered', true),
        )) (state.notes),
      }
    case 'note_released':
      return {
        ...state,
        notes: map(when(
          propEq('note', action.note),
          compose(assoc('isPlaying', false), assoc('triggered', false)),
        )) (state.notes),
      }
    case 'change_volume':
      return {
        ...state,
        volume: action.volume,
      }
    case 'change_waveshape':
      return {
        ...state,
        waveshape: action.waveshape,
      }
    case 'change_ping_pong_delay':
      return {
        ...state,
        pingPongDelay: {
          wet: undefined !== action.wet ? action.wet : state.pingPongDelay.wet,
          feedback: undefined !== action.feedback
            ? action.feedback
            : state.pingPongDelay.feedback,
          delayTime: undefined !== action.delayTime
            ? action.delayTime
            : state.pingPongDelay.delayTime,
          engine: undefined !== action.engine
            ? action.engine
            : state.pingPongDelay.engine,
        }
      }
    default:
      return state
  }
}

export const SynthInstrumentContext = createContext([ initialState, () => null ])

export const SynthInstrument = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState)

  useEffect(() => {
    const instrument = new Tone.PolySynth()

    instrument.set({'oscillator': { 'type': state.waveshape }});

    const pingPongDelay = new Tone.PingPongDelay(state.pingPongDelay.delayTime, state.pingPongDelay.feedback).toMaster();

    pingPongDelay.set('wet', state.pingPongDelay.wet)

    instrument.chain(pingPongDelay)

    dispatch({ type: 'init_instrument', instrument: instrument.toMaster() });
    dispatch({ type: 'change_ping_pong_delay', engine: pingPongDelay });
  }, [])

  useEffect(() => {
    if (!state.instrument) {
      return;
    }

    const toPlays = filter(
      both(
        propEq('isPlaying', true),
        propEq('triggered', false),
     ),
     state.notes
    )
    const toRelease = filter(propEq('isPlaying', false), state.notes)
    const parseFrequencies = map(({ note }) => Tone.Midi(note).toFrequency())

    state.instrument.triggerAttack(parseFrequencies(toPlays))
    state.instrument.triggerRelease(parseFrequencies(toRelease))

    map(({ note }) => dispatch({ type: 'note_triggered', note })) (toPlays)
  }, [state.notes])

  useEffect(() => {
    if (!state.instrument) {
      return;
    }

    const decibels = Tone.gainToDb(state.volume)
    state.instrument.set('volume', decibels)
  }, [state.volume])

  useEffect(() => {
    if (!state.instrument) {
      return;
    }

    state.instrument.set({'oscillator': {'type': state.waveshape}})
  }, [state.waveshape])

  return (
    <SynthInstrumentContext.Provider value={[ state, dispatch ]}>
      { state.instrument ? children : <p>Loading Instrument ...</p> }
    </SynthInstrumentContext.Provider>
  )
}
