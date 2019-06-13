import React from 'react'
import { render } from 'react-dom'
import { SynthInstrument } from './SynthInstrument'
import { SynthController } from './SynthController'
import { Volume } from './Volume'
import { WaveshapeSelector} from './WaveshapeSelector'
import { PingPongDelay } from './PingPongDelay'
import './style.css'

const Synth = () =>
    <SynthInstrument>
      <h1>Instrument Ready</h1>
      <Volume />
      <WaveshapeSelector />
      <PingPongDelay />
      <SynthController />
    </SynthInstrument>

const root = document.getElementById('root')

render(<Synth />, root)
