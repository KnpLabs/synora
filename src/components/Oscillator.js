import React from 'react'
import styled from 'styled-components'
import { ADSR } from './ADSR'
import { ParamKnob } from './ParamKnob'
import { WaveshapeSelector } from './WaveshapeSelector'

export const Oscillator = ({ number }) => {
  return <Wrapper>
    <p>Oscillator {number}</p>
    <WaveshapeSelector className="type" oscillatorNumber={ number }/>
    <div>
      <ParamKnob paramName={ `osc${number}_pitch` } label="PITCH" min="-24" max="24" step="1"/>
      <ParamKnob paramName={ `osc${number}_detune` } label="TUNE" min="-100" max="100"/>
      <ParamKnob paramName={ `osc${number}_phase` } label="PHASE" min="0" max="360"/>
      <ParamKnob paramName={ `osc${number}_vol` } label="VOL" min="0" max="100" factor="100"/>
    </div>
    <ADSR paramPrefix={ `osc${number}` }/>
  </Wrapper>
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  .type {
    flex: none;
    position: absolute;
    right: 1rem;
    top: -0.75rem;
  }
`
