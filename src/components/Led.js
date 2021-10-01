import React, { useContext } from 'react'
import styled from 'styled-components'
import { SynthInstrumentContext } from './Engine'


export const Led = () => {
  const [state] = useContext(SynthInstrumentContext)

  return (
    <Light signal={state.midiSignal}>
    </Light>
  )
}

const Light = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50px;
  border: .2rem solid black;
  background-color: ${props => props.signal ? props.theme.colors.accent1 : props.theme.colors.grey};
`