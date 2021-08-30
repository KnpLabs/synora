import React, { useContext } from 'react';
import { getParam, setParam } from '../state'
import { SynthInstrumentContext } from './Engine'
import { Knob } from './ui/Knob'

export const ParamKnob = ({paramName, factor = 1, ...attrs}) => {
  const [state, dispatch] = useContext(SynthInstrumentContext);

  return <Knob {...attrs} value={getParam(state, paramName) * factor} onChange={val => {
    setParam(dispatch, paramName, val / factor)
  }}/>
}

