import * as Tone from 'tone'
import React, { useContext, useEffect } from 'react'
import { map } from 'ramda'
import { SynthInstrumentContext } from './Engine'
import styled from 'styled-components'

export const SynthController = ({ displayControls = true }) => {
  const [state, dispatch] = useContext(SynthInstrumentContext)

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return console.error('No midi access')
    }

    navigator
      .requestMIDIAccess()
      .then((midiAcess) => {
        const inputs = midiAcess.inputs

        inputs.forEach(input => {
          input.onmidimessage = (message) => {
            if (!message.data) {
              return
            }

            const [type, note] = message.data

            switch (type) {
              case 159:
                dispatch({ type: 'note_pressed', note: note })
                break

              case 143:
                dispatch({ type: 'note_released', note: note })
                break

              default:
                break
            }
          }
        })
      })
      .catch(console.error)
  }, [dispatch])

  return !displayControls
    ? null
    : (
      <Info>
        Played notes :
        {map(({ note, isPlaying }) =>
          isPlaying && <span key={note}> {Tone.Midi(note).toNote()}</span>
        )(state.notes)}
      </Info>
    )
}

const Info = styled.div`
  min-height: 20px;
  margin-top: 10px;
  font-size: 0.75rem;

  & p {
    margin: 0;
  }
`
