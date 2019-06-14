import React, { useContext, useEffect } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'
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
          <label htmlFor="d-amount">Amount: {Math.round(state.distortion.amount * 100)} %</label>
          <br />
          <input type="range" min={0} max={100} value={state.distortion.amount * 100} onChange={event => {
            dispatch({ type: 'change_distortion', amount: event.target.value / 100 })
          }} />
        </div>
      </div>
    </DistortionEffect>
  )
}

const DistortionEffect = styled.div`
  flex: 1!important;
`
