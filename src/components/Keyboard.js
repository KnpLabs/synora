import React, { useContext, useState } from 'react'
import * as Tone from 'tone'
import { SynthInstrumentContext } from './Engine'
import styled from 'styled-components'

export const Keyboard = () => {
  const [state, dispatch] = useContext(SynthInstrumentContext)
  const [active, setActive] = useState(false)

  const isKeyActive = (notes, key) => {
    const note = notes.find(({ note }) => note === key, notes)

    return note && note.isPlaying
  }

  const getVelocity = event => {
    const rect = event.target.getBoundingClientRect()
    const x = event.clientY - rect.top

    return (x / 128)
  }

  const keyPress = (key, event) => dispatch({
    type: 'note_pressed',
    note: key,
    velocity: getVelocity(event),
  })

  const keyRelease = key => dispatch({ type: 'note_released', note: key })

  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))

  const keys = range(36, 89, 1).map(
    key => <Key
      key={ key }
      sharp={ Tone.Midi(key).toNote().includes('#') }
      active={ isKeyActive(state.notes, key) }
      onMouseDown={ event => {
        setActive(true)
        keyPress(key, event)
      } }
      onMouseUp={ () => {
        setActive(false)
        keyRelease(key)
      } }
      onMouseEnter={ event => active && keyPress(key, event) }
      onMouseLeave={ () => active && keyRelease(key) }>
      {isKeyActive(state.notes, key) && Tone.Midi(key).toNote()}
    </Key>
  )

  return (
    <Board onMouseLeave={ () => setActive(false) }>
      {keys}
    </Board>
  )
}

const Board = styled.div`
  display: flex;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
`

const Key = styled.button`
  display: block;
  border: 1px solid ${props => props.theme.colors.grey};
  border-right: none;
  background-color: ${props => props.active
  ? props.theme.colors.accent1
  : props.sharp ? props.theme.colors.keys.black : props.theme.colors.keys.white};
  color: white;
  margin-left: ${props => props.sharp ? '-1.6%' : 0};
  margin-right: ${props => props.sharp ? '-1.6%' : 0};
  z-index: ${props => props.sharp ? '1' : 0};
  flex: ${props => props.sharp ? '0.8' : '1'};
  min-width: 1%;
  height: ${props => props.sharp ? '60px' : '110px'};
  vertical-align: bottom;
  box-shadow: inset 0 3px ${props => props.active ? '15px' : '10px'}
  ${props => props.sharp ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 0 0 4px 4px;
  font-size: ${props => props.sharp ? '10px' : '11px'};
  font-weight: bold;
  line-height: ${props => props.sharp ? '75px' : '140px'};
  outline: none;
`
