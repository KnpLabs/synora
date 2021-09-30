import * as Tone from 'tone'
import React, { useContext, useEffect } from 'react'
import { SynthInstrumentContext } from './Engine'
import styled from 'styled-components'
import { getMIDIDevice } from '../state'

const STATUSBYTE_NOTEOFF = 0x8;
const STATUSBYTE_NOTEON = 0x9;
const STATUSBYTE_CONTROLCHANGE = 0xA;

const isMessageStatus = (type, status) => Math.floor(type / 0x10) === status

export const SynthController = ({ displayControls = true }) => {
  const [state, dispatch] = useContext(SynthInstrumentContext)
  const device = getMIDIDevice(state)

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return console.error('No midi access')
    }

    navigator
      .requestMIDIAccess()
      .then((midiAccess) => {
        midiAccess.onstatechange = (event) => {
          const type = event.port.state === 'connected' ? 'midi_device_connect' : 'midi_device_disconnect'
          dispatch({ type, device: event.port })
        }

        if (!device) {
          return
        }

        device.onmidimessage = (message) => {
          if (!message.data) {
            return
          }

          const [type, note] = message.data

          switch (type) {
            case 144:
              dispatch({ type: 'note_pressed', note: note })
              break

            case 128:
              dispatch({ type: 'note_released', note: note })
              break

            default:
              break
          }
        }
      })
      .catch(console.error)
  }, [dispatch, device])

  return !displayControls
    ? null
    : (
      <Info>
        Played notes :
        {state.notes.map(({ note, isPlaying }) =>
          isPlaying && <span key={note}> {Tone.Midi(note).toNote()}</span>
        )}
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
