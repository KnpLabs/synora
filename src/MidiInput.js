import { useEffect } from 'react'

export const MidiInput = ({ onMessage = () => null }) => {
  useEffect(setupMidiAccess(onMessage), [])

  return null;
}

const setupMidiAccess = onMessage => () => {
  if (!navigator.requestMIDIAccess) {
    return console.error('No midi access')
  }

  navigator.requestMIDIAccess({
      sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
  })
  .then(bindInputs(onMessage))
  .catch(console.error)
}

const bindInputs = onMessage => (midiAcess) => {
  const inputs = midiAcess.inputs
  inputs.forEach(input => {
    input.onmidimessage = onMessage;
  })
}