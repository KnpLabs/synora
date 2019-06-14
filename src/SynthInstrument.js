import Tone from 'tone'
import styled from 'styled-components'
import React, { createContext, useReducer, useEffect } from 'react'
import { append, ifElse, find, when, assoc, propEq, map, compose, filter, both } from 'ramda'

const initialState = {
  notes: [],
  instrument: null,
  volume: {
    amount: 0.5,
    engine: null,
  },
  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 1,
    release: 0.4,
  },
  waveshape: 'sawtooth',
  distortion: {
    amount: 0,
    engine: null,
  },
  pingPongDelay: {
    engine: null,
    wet: 1,
    delayTime: 0.2,
    feedback: 0.3,
  },
  meter: {
      level: 0,
      offset: 70,
      engine: null,
  }
}

const reducer = (state = initialState, action) => {
  if (!action) {
    return state
  }

  switch(action.type) {
    case 'init_instrument':
      return { ...state, instrument: action.instrument }
    case 'init_meter':
      return {...state, meter: { ...state.meter, engine: action.engine } }
    case 'update_meter':
      return { ...state, meter: { ...state.meter, level: parseInt(state.meter.offset) + state.meter.engine.getLevel()} }
    case 'update_meter_offset':
        return { ...state, meter: { ...state.meter, offset: action.offset} }
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
    case 'set_volume_engine':
      return {
        ...state,
        volume: {
          ...state.volume,
          engine: action.engine,
        }
      }
    case 'change_volume':
      return {
        ...state,
        volume: {
          ...state.volume,
          amount: action.volume,
        },
      }
    case 'change_envelope':
      return {
        ...state,
        envelope: {
          attack: undefined !== action.attack ? action.attack : state.envelope.attack,
          decay: undefined !== action.decay ? action.decay : state.envelope.decay,
          sustain: undefined !== action.sustain ? action.sustain : state.envelope.sustain,
          release: undefined !== action.release ? action.release : state.envelope.release,
        }
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
    case 'change_distortion':
      return {
        ...state,
        distortion: {
          amount: undefined !== action.amount ? action.amount : state.distortion.amount,
          engine: undefined !== action.engine ? action.engine : state.distortion.engine,
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

    const distortion = new Tone.Distortion(state.distortion.amount);
    const pingPongDelay = new Tone.PingPongDelay(state.pingPongDelay.delayTime, state.pingPongDelay.feedback);
    const volume = new Tone.Volume(state.volume.amount)

    distortion.set('oversampling', '4x');
    pingPongDelay.set('wet', state.pingPongDelay.wet);

    const meter = new Tone.Meter();
    instrument.chain(distortion, pingPongDelay, volume, meter, Tone.Master)

    dispatch({ type: 'init_instrument', instrument: instrument });
    dispatch({ type: 'change_distortion', engine: distortion });

    dispatch({ type: 'change_ping_pong_delay', engine: pingPongDelay });
    dispatch({ type: 'set_volume_engine', engine: volume });
    dispatch({ type: 'init_meter', engine : meter });
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
    if (!state.instrument || !state.volume.engine) {
      return;
    }

    const decibels = Tone.gainToDb(state.volume.amount)
    state.volume.engine.set('volume', decibels)
  }, [state.volume.amount, state.volume.engine])

  useEffect(() => {
    if (!state.instrument) {
      return;
    }

    state.instrument.set({'envelope': {
      'attack': state.envelope.attack,
      'decay': state.envelope.decay,
      'sustain': state.envelope.sustain,
      'release': state.envelope.release
    }});
  }, [state.envelope, state.instrument])

  useEffect(() => {
    if (!state.instrument) {
      return;
    }

    state.instrument.set({'oscillator': {'type': state.waveshape}})
  }, [state.waveshape])

  return (
    <Rack>
      <SynthInstrumentContext.Provider value={[ state, dispatch ]}>
        { state.instrument ? children : <p>Loading Instrument ...</p> }
      </SynthInstrumentContext.Provider>
    </Rack>
  );
}

const Rack = styled.div`
  overflow: hidden;
  border: 1px solid gray;
  padding: 1em;
  background-color: #234760;
  color: #eee;
  box-shadow: inset 0 0 140px rgba(0, 0, 0, 0.2), 0 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`
