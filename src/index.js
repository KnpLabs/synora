import React, { useEffect } from 'react'
import { render } from 'react-dom'
import Tone from 'tone'
import './style.css'

const Synth = () => {
  useEffect(setupTone, [])

  return (
    <div>
      <p>Synthetizer goes here :)</p>
    </div>
  )
}

const setupTone = () => {
  //create a synth and connect it to the master output (your speakers)
  var synth = new Tone.Synth().toMaster()

  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease('C4', '8n')
}

const root = document.getElementById('root')

render(<Synth />, root)