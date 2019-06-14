import React, { useContext } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'
import styled from 'styled-components'

export const ADSR = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

  return (
    <ADSRRack>
      <div className="attack">
        <label htmlFor="adsr-atk">ATK </label>
        <br />
        <Knob type="range" min={0} max={1000} cursor={state.envelope.attack} value={state.envelope.attack * 1000} onChange={event => {
          dispatch({ type: 'change_envelope', attack: event.target.value / 1000 })
        }} />
        <br />
        {Math.round(state.envelope.attack * 1000)} ms
      </div>
      <div className="decay">
        <label htmlFor="adsr-dec">DEC</label>
        <br />
        <Knob type="range" min={0} max={1000} cursor={state.envelope.decay} value={state.envelope.decay * 1000} onChange={event => {
          dispatch({ type: 'change_envelope', decay: event.target.value / 1000 })
        }} />
        <br />
        {Math.round(state.envelope.decay * 1000)} ms
      </div>
      <div className="sustain">
        <label htmlFor="adsr-sus">SUS</label>
        <br />
        <Knob type="range" min={0} max={100}  cursor={state.envelope.sustain} value={state.envelope.sustain * 100} onChange={event => {
          dispatch({ type: 'change_envelope', sustain: event.target.value / 100 })
        }} />
        <br />
        {Math.round(state.envelope.sustain * 100)} %
      </div>
      <div className="release">
        <label htmlFor="adsr-rel">REL</label>
        <br />
        <Knob type="range" min={1} max={4000}  cursor={state.envelope.release / 4} value={state.envelope.release * 1000} onChange={event => {
          dispatch({ type: 'change_envelope', release: event.target.value / 1000 })
        }} />
        <br />
        {Math.round(state.envelope.release * 1000)} ms
      </div>
    </ADSRRack>
  )
}

const ADSRRack = styled.div`
  display: flex;
  margin-bottom: 1em;
  width: 33%;

  > * {
    flex: 1;
    text-align: center;
  }
`

const Knob = styled.input`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 60px;
  visibility: hidden;
  margin-top: 0.5em;

  &:before {
    visibility: visible;
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 16px solid gray;
    border-bottom-color: transparent;
    border-radius: 50%;

  }

  &:after {
    content: '';
    visibility: visible;
    position: absolute;
    display: block;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    background-color: orange;
    border-radius: 50%;
    left: 50%;
    margin-left: -8px;
    bottom: 0;
    transform: rotate(${props => props.cursor * 270 + 45}deg);
    transform-origin: 8px -14px;
  }

  &:hover:after {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    border:1px solid rgba(0, 0, 0, 0.2)
  }
`
