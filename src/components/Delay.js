import React from 'react'
import { ParamKnob } from './ParamKnob'
import styled from 'styled-components'

export const Delay = () => (
  <DelayEffect>
    <p>Delay</p>
    <div>
      <ParamKnob paramName="delay_time" label="DELAY" min="0" max="1000" factor="1000"/>
      <ParamKnob paramName="delay_feed" label="FEED" min="0" max="100" factor="100"/>
      <ParamKnob paramName="delay_wet" label="D/W" min="0" max="100" factor="100"/>
    </div>
  </DelayEffect>
)

const DelayEffect = styled.div`
  flex: 3!important;

  > div {
    display: flex;
  }
`
