import React, { useContext, useEffect } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'
import { Knob } from './Knob'
import styled from 'styled-components'

export const Distortion = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

  useEffect(() => {
    if (!state.instrument || !state.distortion.engine) {
      return;
    }

    state.distortion.engine.set('distortion', state.distortion.amount);
  }, [state.distortion])

  return (
    <DistortionEffect>
      <p>Distortion</p>
      <div>
        <div className="amount">
          <Knob label={'Amount'} min={0} max={100} value={state.distortion.amount * 100} onChange={val => {
            dispatch({ type: 'change_distortion', amount: val / 100 })
          }} payload={Math.round(state.distortion.amount * 100) + ' %'} />
        </div>
      </div>
    </DistortionEffect>
  )
}

const DistortionEffect = styled.div`
  flex: 1!important;

  > div {
    display: flex;
  }
  div > div {
    flex: 1
    text-align: center;
  }
`
