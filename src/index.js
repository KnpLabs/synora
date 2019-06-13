import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import Tone from 'tone'
import { MidiInput } from './MidiInput'
import './style.css'

const Synth = () => {
  const [tone, setSynth] = useState(null)
  const [freq, setFreq] = useState(null)

  useEffect(() => {
    //create a synth and connect it to the master output (your speakers)
    setSynth(new Tone.Synth().toMaster());
  }, [])

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      return console.error('No midi access')
    }

    navigator.requestMIDIAccess({
        sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
    })
    .then((midiAcess) => {
      const inputs = midiAcess.inputs

      inputs.forEach(input => {
        input.onmidimessage = (message) => {
          const [ type, note, velocity ] = message.data

          if (217 === type) {
            return;
          }

          const frequency = Tone.Midi(note).toFrequency()

          if (137 === type) {
            setFreq(null)

            return;
          }

          setFreq(frequency)
        };
      })
    })
    .catch(console.error)
  }, [])

  useEffect(() => {
    if (!tone) {
      return;
    }

    if (!freq) {
      tone.triggerRelease()
      return;
    }

    tone.triggerAttack(freq)
  }, [freq])

  return (
    <div>
      <div>{freq}</div>
      <p>Synthetizer goes here :)</p>
    </div>
  )
}

const handleMessage = (synth, message) => {
  console.warn(synth);
  if (synth === null) {
    return;
  }

  const [type, note, velocity] = message.data;

  if (velocity <= 0) {
    synth.triggerRelease();

    return;
  }

  const frequency = Tone.Midi(note).toFrequency();
  console.warn(frequency);

  synth.triggerAttack(frequency);
}

const root = document.getElementById('root')

render(<Synth />, root)
