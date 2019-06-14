import React, { useContext, useEffect } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'
import { Knob } from './Knob'
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
          <Knob label={'Wet'} min={0} max={100} value={state.pingPongDelay.wet * 100} onChange={val => {
            dispatch({ type: 'change_ping_pong_delay', wet: val / 100 })
          }} payload={Math.round(state.pingPongDelay.wet * 100) + ' %'} />
        </div>

        <div className="time">
          <Knob label={'Delay'} min={0} max={100} value={state.pingPongDelay.delayTime * 10} onChange={val => {
            dispatch({ type: 'change_ping_pong_delay', delayTime: val / 10 })
          }} payload={state.pingPongDelay.delayTime + ' s'} />
        </div>

        <div className="feedback">
          <Knob label={'Feedback'} min={0} max={100} value={state.pingPongDelay.feedback * 100} onChange={val => {
            dispatch({ type: 'change_ping_pong_delay', feedback: val / 100 })
          }} payload={Math.round(state.pingPongDelay.feedback * 100) + ' %'} />
        </div>
      </div>
    </DelayEffect>
  )
}

const DelayEffect = styled.div`
  flex: 4!important;

  > div {
    display: flex;
  }

  div > div {
    flex: 1;
    text-align: center;
  }
`
