import React, { useContext } from 'react'
import { SynthInstrumentContext } from './SynthInstrument'

export const Volume = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)

  return (
    <div>
      <p>Volume: {state.volume}</p>
      <input type="range" min={0} max={100} value={state.volume * 100} onChange={event => {
        const volume = event.target.value / 100;

        dispatch({ type: 'change_volume', volume })
      }} />
    </div>
  )
}