import React, { useEffect, useReducer } from 'react'
import { render } from 'react-dom'
import Tone from 'tone'
import { MidiInput } from './MidiInput'
import { append, ifElse, find, when, assoc, propEq, map, filter, both, compose } from 'ramda'
import './style.css'

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

const Synth = () => {
  const [ state, dispatch ] = useReducer(reducer, initialState)

  useEffect(() => {
    //create a synth and connect it to the master output (your speakers)
    dispatch({ type: 'init_tone', tone: new Tone.PolySynth().toMaster() });
  }, [])

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return console.error('No midi access')
    }

    navigator.requestMIDIAccess({
        sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
    })
    .then((midiAcess) => {
      const inputs = midiAcess.inputs

      inputs.forEach(input => {
        input.onmidimessage = (message) => {
          if (!message.data) {
            return;
          }

          const [ type, note, velocity ] = message.data

          if (217 === type) {
            return;
          }

          const frequency = Tone.Midi(note).toFrequency()

          if (137 === type) {
            dispatch({ type: 'note_released', note: note })

            return;
          }

          dispatch({ type: 'note_pressed', note: note })
        };
      })
    })
    .catch(console.error)
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
    <div>
      { map(({ note, isPlaying, triggered }) =>
        <div>
          Note: {note}
          <br/>
          isPlaying: {isPlaying ? 'Yep' : 'Nop'}
          <br />
          Triggered: {triggered ? 'Yep' : 'Nop'}
        </div>
      ) (state.notes)}
      <p>Synthetizer goes here :)</p>
    </div>
  )
}

const root = document.getElementById('root')

render(<Synth />, root)
