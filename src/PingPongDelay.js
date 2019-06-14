import React, { useContext, useEffect } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'
import styled from 'styled-components'

export const PingPongDelay = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

  useEffect(() => {
    if (!state.pingPongDelay.engine) {
      return;
    }

    state.pingPongDelay.engine.set('wet', state.pingPongDelay.wet)
    state.pingPongDelay.engine.set('delayTime', state.pingPongDelay.delayTime)
    state.pingPongDelay.engine.set('feedback', state.pingPongDelay.feedback)
  }, [state.pingPongDelay])

  return (
    <DelayEffect>
      <p>Ping Pong Delay</p>
      <div>
        <div className="wet">
          <label htmlFor="ppd-wet">Wet: {Math.round(state.pingPongDelay.wet * 100)} %</label>
          <br />
          <input type="range" min={0} max={100} value={state.pingPongDelay.wet * 100} onChange={event => {
            const newWet = event.target.value / 100

            dispatch({ type: 'change_ping_pong_delay', wet: newWet })
          }} />
        </div>
        <div className="time">
          <label htmlFor="ppd-delayTime">Delay Time: {state.pingPongDelay.delayTime}s</label>
          <br />
          <input type="range" min={0} max={100} value={state.pingPongDelay.delayTime * 10} onChange={event => {
            const delayTime = event.target.value / 10

            dispatch({ type: 'change_ping_pong_delay', delayTime })
          }} />
        </div>
        <div className="feedback">
          <label htmlFor="ppd-feedback">Feedback: {Math.round(state.pingPongDelay.feedback * 100)} %</label>
          <br />
          <input type="range" min={0} max={100} value={state.pingPongDelay.feedback * 100} onChange={event => {
            const feedback = event.target.value / 100

            dispatch({ type: 'change_ping_pong_delay', feedback })
          }} />
        </div>
      </div>
    </DelayEffect>
  )
}

const DelayEffect = styled.div`
  clear: both;
  border: 1px solid rgba(127, 127, 127, 0.6);
  padding: 1em;
  margin-bottom: 1rem;

  p {
    margin: -24px 0 1em 0;
    padding-left: 1em;
    background-color: #234760;
  }

  &>div {
    display: flex;
  }
`
