import React, { useContext } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'
import styled from 'styled-components'

export const Volume = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

  return (
    <VolumeKnob>
      <p>Volume: {state.volume.amount}</p>
      <input type="range" min={0} max={100} value={state.volume.amount * 100} onChange={event => {
        const volume = event.target.value / 100;

        dispatch({ type: 'change_volume', volume })
      }} />
    </VolumeKnob>
  )
}

const VolumeKnob = styled.div`
  position: absolute;
  top: 30px;
  right: 2em;

  & > * {
    display: inline;
  }

  & p {
    margin-right: 10px;
  }

  & input {
    vertical-align: middle;
  }
`
