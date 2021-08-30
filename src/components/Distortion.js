import React from 'react'
import { ParamKnob } from './ParamKnob'
import styled from 'styled-components'

export const Distortion = () => (
  <DistortionEffect>
    <p>Distortion</p>
    <div>
      <ParamKnob paramName="dist_amt" label="AMT" min="0" max="100" factor="100" />
    </div>
  </DistortionEffect>
)

const DistortionEffect = styled.div`
  flex: 1!important;

  > div {
    display: flex;
  }
`
