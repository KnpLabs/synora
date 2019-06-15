import React, { useContext } from 'react'
import { range, map, find } from 'ramda'
import Tone from 'tone'
import { SynthInstrumentContext } from './SynthInstrument'
import styled from 'styled-components'

export const Keyboard = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext);

  const isKeyActive = (notes, key) => {
    const note = find(({note}) => note === key, notes);

    return note && note.isPlaying;
  };

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
  );

  return (
    <Board>
      {keys}
    </Board>
  )
};

const Board = styled.div`
  display: flex;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
`

const Key = styled.button`
  display: block;
  border: 1px solid black;
  background-color: ${props => props.active ? 'orange' : props.sharp ? 'black' : 'white'};
  color: ${props => props.sharp ? '#ddd' : '#333'};
  margin-left: ${props => props.sharp ? '-1.6%' : 0};
  margin-right: ${props => props.sharp ? '-1.6%' : 0};
  z-index: ${props => props.sharp ? '1' : 0}
  flex: ${props => props.sharp ? '0.9' : '1'};
  min-width: 1%;
  height: ${props => props.sharp ? '100px' : '180px'};
  vertical-align: bottom;
  box-shadow: inset 0 3px ${props => props.active ? '15px' : '10px'} ${props => props.sharp ? 'grey' : 'rgba(0, 0, 0, 0.5)'};
  border-radius: 0 0 4px 4px;
  font-size: ${props => props.sharp ? '10px' : '11px'};
  font-weight: bold;
  line-height: ${props => props.sharp ? '115px' : '230px'};
`
