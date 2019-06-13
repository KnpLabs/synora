import React from 'react'
import { render } from 'react-dom'
import { SynthInstrument } from './SynthInstrument'
import { SynthController } from './SynthController'
import './style.css'

const Synth = () =>
    <SynthInstrument>
      <h1>Instrument Ready</h1>
      <SynthController />
    </SynthInstrument>

const root = document.getElementById('root')

render(<Synth />, root)
