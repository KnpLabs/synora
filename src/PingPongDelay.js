import React, { useContext, useEffect } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'

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
    <div>
      <p>Ping Pong Delay</p>
      <div>
        <label htmlFor="ppd-wet">Wet: {Math.round(state.pingPongDelay.wet * 100)} %</label>
        <br />
        <input type="range" min={0} max={100} value={state.pingPongDelay.wet * 100} onChange={event => {
          const newWet = event.target.value / 100

          dispatch({ type: 'change_ping_pong_delay', wet: newWet })
        }} />
      </div>
      <div>
        <label htmlFor="ppd-delayTime">Delay Time: {state.pingPongDelay.delayTime}s</label>
        <br />
        <input type="range" min={0} max={100} value={state.pingPongDelay.delayTime * 10} onChange={event => {
          const delayTime = event.target.value / 10

          dispatch({ type: 'change_ping_pong_delay', delayTime })
        }} />
      </div>
      <div>
        <label htmlFor="ppd-feedback">Feedback: {Math.round(state.pingPongDelay.feedback * 100)} %</label>
        <br />
        <input type="range" min={0} max={100} value={state.pingPongDelay.feedback * 100} onChange={event => {
          const feedback = event.target.value / 100

          dispatch({ type: 'change_ping_pong_delay', feedback })
        }} />
      </div>
    </div>
  )
}