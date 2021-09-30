import * as Tone from 'tone'
import React, { useContext, useEffect } from 'react'
import { map } from 'ramda'
import { SynthInstrumentContext } from './Engine'
import styled from 'styled-components'

const STATUSBYTE_NOTEOFF = 0x8;
const STATUSBYTE_NOTEON = 0x9;
const STATUSBYTE_CONTROLCHANGE = 0xA;

const isMessageStatus = (type, status) => Math.floor(type / 0x10) === status

export const SynthController = ({ displayControls = true }) => {
  const [state, dispatch] = useContext(SynthInstrumentContext)

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return console.error('No midi access')
    }

    navigator
      .requestMIDIAccess()
      .then((midiAccess) => {
        const inputs = midiAccess.inputs

        inputs.forEach(input => {
          input.onmidimessage = (message) => {
            if (!message.data) {
              return
            }

            const [type, note] = message.data

            switch (true) {
              case isMessageStatus(type, STATUSBYTE_NOTEON):
                dispatch({ type: 'note_pressed', note })
                break

              case isMessageStatus(type, STATUSBYTE_NOTEOFF):
                dispatch({ type: 'note_released', note })
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
