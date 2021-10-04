import * as Tone from 'tone'
import React, { useCallback, useContext, useEffect } from 'react'
import { SynthInstrumentContext } from './Engine'
import styled from 'styled-components'
import { getMIDIDevice } from '../state'

const STATUSBYTE_NOTEOFF = 0x8
const STATUSBYTE_NOTEON = 0x9

const isMessageStatus = (type, status) => Math.floor(type / 0x10) === status

export const SynthController = ({ displayControls = true }) => {
  const [state, dispatch] = useContext(SynthInstrumentContext)
  const device = getMIDIDevice(state)

  const midiDevicesHandler = useCallback(
    event => {
      const type = event.port.state === 'connected' ? 'midi_device_connect' : 'midi_device_disconnect'

      if (state.midi.device === null) {
        dispatch({ type: 'midi_switch_device', device: event.port })
      }

      dispatch({ type, device: event.port })
    },
    [device, dispatch]
  )

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return console.error('No midi access')
    }

    navigator
      .requestMIDIAccess()
      .then(midiAccess => {
        midiAccess.onstatechange = midiDevicesHandler

        if (!device) {
          return
        }

        device.onmidimessage = message => {
          dispatch({ type: 'midi_signal', status: true })
          setTimeout(() => {
            dispatch({ type: 'midi_signal', status: false })
          }, 50)

          if (!message.data || message.target.id !== device.id) {
            return
          }

          const [type, note] = message.data

          switch (true) {
            case isMessageStatus(type, STATUSBYTE_NOTEON):
              dispatch({ type: 'note_pressed', note: note })
              break

            case isMessageStatus(type, STATUSBYTE_NOTEOFF):
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
          isPlaying && <span key={ note }> {Tone.Midi(note).toNote()}</span>
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
