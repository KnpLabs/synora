import React from 'react'
import styled from 'styled-components'
import { ParamKnob } from './ParamKnob'

export const FrequencyShifter = () => (
  <FrequencyShifterEffect>
    <p>Frequency Shifter</p>
    <div>
      <ParamKnob paramName="shft_freq" label="FREQ" min="-500" max="500"/>
      <ParamKnob paramName="shft_wet" label="D/W" min="0" max="100" factor="100" />
    </div>
  </FrequencyShifterEffect>
)

const FrequencyShifterEffect = styled.div`
  flex: 2!important;

  > div {
    display: flex;
  }
`
