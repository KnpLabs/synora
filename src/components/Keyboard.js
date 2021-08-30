import React, { useContext, useState } from 'react'
import { range, map, find } from 'ramda'
import * as Tone from 'tone'
import { SynthInstrumentContext } from './Engine'
import styled from 'styled-components'

export const Keyboard = () => {
  const [state, dispatch] = useContext(SynthInstrumentContext)
  const [active, setActive] = useState(false)

  const isKeyActive = (notes, key) => {
    const note = find(({ note }) => note === key, notes)

    return note && note.isPlaying
  }

  const keyPress = key => dispatch({ type: 'note_pressed', note: key })

  const keyRelease = key => dispatch({ type: 'note_released', note: key })

  const keys = map(
    (key) => <Key
      key={key}
      sharp={Tone.Midi(key).toNote().includes('#')}
      active={isKeyActive(state.notes, key)}
      onMouseDown={() => {
        setActive(true)
        keyPress(key)
      }}
      onMouseUp={() => {
        setActive(false)
        keyRelease(key)
      }}
      onMouseEnter={() => active && keyPress(key)}
      onMouseLeave={() => active && keyRelease(key)}>
      {isKeyActive(state.notes, key) && Tone.Midi(key).toNote()}
    </Key>,
    range(36, 89)
  )

  return (
    <Board onMouseLeave={() => setActive(false)}>
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
  background-color: ${props => props.active ? props.theme.colors.accent1 : props.sharp ? props.theme.colors.keys.black : props.theme.colors.keys.white};
  color: white;
  margin-left: ${props => props.sharp ? '-1.6%' : 0};
  margin-right: ${props => props.sharp ? '-1.6%' : 0};
  z-index: ${props => props.sharp ? '1' : 0};
  flex: ${props => props.sharp ? '0.8' : '1'};
  min-width: 1%;
  height: ${props => props.sharp ? '60px' : '110px'};
  vertical-align: bottom;
  box-shadow: inset 0 3px ${props => props.active ? '15px' : '10px'} ${props => props.sharp ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 0 0 4px 4px;
  font-size: ${props => props.sharp ? '10px' : '11px'};
  font-weight: bold;
  line-height: ${props => props.sharp ? '75px' : '140px'};
  outline: none;
`
