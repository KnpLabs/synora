import React, { useContext } from 'react'
import { map } from 'ramda'
import { SynthInstrumentContext } from './SynthInstrument'

export const WaveshapeSelector = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

  const waveshapes = ['sine', 'square', 'triangle', 'sawtooth'];

  const items = map(shape => <option key={shape} value={shape}>{shape}</option>)(waveshapes)

  return (
    <div>
      <p>
        Waveshape:&nbsp;
        <select defaultValue={state.waveshape} onChange={event => {
          const waveshape = event.target.value;

          dispatch({ type: 'change_waveshape', waveshape})
        }}>
          {items}
        </select>
      </p>
    </div>
  )
}
