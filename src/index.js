import React from 'react'
import { render } from 'react-dom'

const Synth = () =>
  <div>
    <p>Synthetizer goes here :)</p>
  </div>

const root = document.getElementById('root')

render(<Synth />, root)