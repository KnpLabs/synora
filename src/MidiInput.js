import { useEffect } from 'react'

export const MidiInput = ({ onMessage = () => null }) => {
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
        input.onmidimessage = (message) => onMessage(message);
      })
    })
    .catch(console.error)

  }, [])

  return null;
}
