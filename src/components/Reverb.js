import React from 'react'
import { ParamKnob } from './ParamKnob'
import styled from 'styled-components'

export const Reverb = () => (
  <ReverbEffect>
    <p>Reverb</p>
    <div>
      <ParamKnob paramName="verb_wet" label="D/W" min="0" max="100" factor="100" />
      <ParamKnob paramName="verb_time" label="DECAY" min="1" max="10000" factor="1000" />
    </div>
  </ReverbEffect>
)

const ReverbEffect = styled.div`
  flex: 1!important;

  > div {
    display: flex;
  }
`
