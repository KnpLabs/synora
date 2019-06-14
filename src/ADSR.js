import React, { useContext } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'
import { Knob } from './Knob'
import styled from 'styled-components'

export const ADSR = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

  return (
    <ADSRRack>
      <div className="attack">
        <Knob label={'ATK'} min={0} max={1000} value={state.envelope.attack * 1000} onChange={val => {
          dispatch({ type: 'change_envelope', attack: val / 1000 })
        }} payload={Math.round(state.envelope.attack * 1000) + ' ms'} />
      </div>

      <div className="decay">
        <Knob label={'DEC'} min={0} max={1000} value={state.envelope.decay * 1000} onChange={val => {
          dispatch({ type: 'change_envelope', decay: val / 1000 })
        }} payload={Math.round(state.envelope.decay * 1000) + ' ms'} />
      </div>

      <div className="sustain">
        <Knob label={'SUS'} min={0} max={100} value={state.envelope.sustain * 100} onChange={val => {
          dispatch({ type: 'change_envelope', sustain: val / 100 })
        }} payload={Math.round(state.envelope.sustain * 100) + ' %'} />
      </div>

      <div className="release">
        <Knob label={'REL'} min={1} max={4000} value={state.envelope.release * 1000} onChange={val => {
          dispatch({ type: 'change_envelope', release: val / 1000 })
        }} payload={Math.round(state.envelope.release * 1000) + ' ms'}/>
      </div>
    </ADSRRack>
  )
}

const ADSRRack = styled.div`
  flex: 4!important;
  display: flex;
  margin-bottom: 1em;

  div  {
    flex: 1;
    text-align: center;
  }
`
