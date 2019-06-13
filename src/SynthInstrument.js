import Tone from 'tone'
import React, { createContext, useReducer, useEffect } from 'react'
import { append, ifElse, find, when, assoc, propEq, map, compose, filter, both } from 'ramda'

const initialState = {
  notes: [],
  tone: null,
}

const reducer = (state = initialState, action) => {
  if (!action) {
    return state
  }

  switch(action.type) {
    case 'init_tone':
      return { ...state, tone: action.tone }
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
    default:
      return state
  }
}

export const SynthInstrumentContext = createContext([ initialState, () => null ])

export const SynthInstrument = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState)

  useEffect(() => {
    //create a synth and connect it to the master output (your speakers)
    dispatch({ type: 'init_tone', tone: new Tone.PolySynth().toMaster() });
  }, [])

  useEffect(() => {
    if (!state.tone) {
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

    state.tone.triggerAttack(parseFrequencies(toPlays))
    state.tone.triggerRelease(parseFrequencies(toRelease))

    map(({ note }) => dispatch({ type: 'note_triggered', note })) (toPlays)
  }, [state.notes])

  return (
    <SynthInstrumentContext.Provider value={[ state, dispatch ]}>
      { state.tone ? children : <p>Loading Instrument ...</p> }
    </SynthInstrumentContext.Provider>
  )
}