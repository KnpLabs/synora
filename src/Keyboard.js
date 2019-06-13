import React, { useContext } from 'react'
import { range, map, find } from 'ramda'
import Tone from 'tone'
import { SynthInstrumentContext } from './SynthInstrument'
import styled from 'styled-components'

export const Keyboard = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

  const isKeyActive = (notes, key) => {
    const note = find(({note}) => note === key, notes)

    return note && note.isPlaying;
  }

  const keys = map(
    (key) => <Key
      key={key}
      sharp={Tone.Midi(key).toNote().includes('#')}
      active={isKeyActive(state.notes, key)}
      onMouseDown={event => dispatch({ type: 'note_pressed', note: key })}
      onMouseUp={event => dispatch({ type: 'note_released', note: key })}>
      {Tone.Midi(key).toNote()}
    </Key>,
    range(36, 89)
  )

  return (
    <Board>
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
  border: 1px solid black;
  background-color: ${props => props.active ? 'red' : props.sharp ? 'black' : 'white'};
  color: ${props => props.sharp ? 'white' : 'black'};
  margin-left: ${props => props.sharp ? '-15px' : 0};
  margin-right: ${props => props.sharp ? '-15px' : 0};
  z-index: ${props => props.sharp ? '1' : 0}
  min-width: ${props => props.sharp ? '1.8%' : '3.3%'};
  height: ${props => props.sharp ? '80px' : '140px'};
  vertical-align: bottom;
  box-shadow: inset 0 3px ${props => props.active ? '15px' : '10px'} ${props => props.sharp ? 'grey' : 'rgba(0, 0, 0, 0.5)'};
  border-radius: 0 0 4px 4px;
  font-size: 9px;
  line-height: ${props => props.sharp ? '115px' : '230px'};
`
