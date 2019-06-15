import Tone from 'tone'
import React, { useContext, useEffect } from 'react'
import { map } from 'ramda'
import { SynthInstrumentContext } from './SynthInstrument'
import styled from 'styled-components'

export const SynthController = ({ displayControls = true }) => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

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

          if (type === 176) {
            if (note === 3) {
              dispatch({ type: 'change_volume', volume: velocity / 127 })
            }

            return;
          }

          if (217 === type) {
            return;
          }

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

  return !displayControls
    ? null
    : (
      <Info>
        Played notes :
        {map(({ note, isPlaying }) =>
          isPlaying && <span key={note}> {Tone.Midi(note).toNote()}</span>
        ) (state.notes)}
      </Info>
    )
}

const Info = styled.div`
  min-height: 20px;
  margin-top: 10px;

  & p {
    margin: 0;
  }
`
