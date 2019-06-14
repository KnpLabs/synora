import { SynthInstrumentContext } from './SynthInstrument'
import React, { useContext, useEffect } from 'react'
import scribble from 'scribbletune'
import { map, addIndex, repeat, flatten, find, contains, isEmpty, reduce, append, join, splitEvery, replace } from 'ramda';
import styled from 'styled-components'

const notes = [ 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b' ]

const imap = addIndex(map)

export const MidiEditor = () => {
  const [ state, dispatch ] = useContext(SynthInstrumentContext)
  const isNoteActive = (note, cellIndex) => contains(note, state.midiEditor.cells[cellIndex])

  useEffect(() => {
    if (!state.midiEditor.clip) {
      return;
    }

    if (!state.midiEditor.isPlaying) {
      state.midiEditor.clip.removeAll()
      window.Tone.Transport.stop()

      return
    }

    state.midiEditor.clip.start()
    window.Tone.Transport.start()
  }, [state.midiEditor.clip, state.midiEditor.isPlaying])

  useEffect(() => {
    if (!state.midiEditor.isPlaying) {
      dispatch({ type: 'stop_midi_clip' })

      return;
    }

    const notes = reduce((notes, cell) =>
      isEmpty(cell)
      ? notes
      : append(join('', cell), notes)
    , [], state.midiEditor.cells)
    const pattern = replace(/\[--------\]/g, '-', reduce((pat, group) =>
      `${pat}[${reduce((acc, cell) =>
          isEmpty(cell) ? `${acc}-` : `${acc}x`
        , '', group)}]`
    , '', splitEvery(8, state.midiEditor.cells)))

    console.warn(notes, pattern)

    const clip = scribble.clip({
      instrument: state.instrument,
      notes,
      pattern,
    })

    dispatch({ type: 'start_midi_clip', clip })
  }, [state.midiEditor.isPlaying])

  return (
    <MidiGrid>
      {imap((cell, cellIndex) => (
        <MidiColumn>
          {imap((notes, noteIndex) =>
            map(note =>
              <MidiNote
                active={isNoteActive(`${note}${noteIndex + 2}`, cellIndex)}
                onClick={e => {
                  isNoteActive(`${note}${noteIndex + 2}`, cellIndex)
                    ? dispatch({ type: 'remove_midi_note', cell: cellIndex, note: `${note}${noteIndex + 2}` })
                    : dispatch({ type: 'add_midi_note', cell: cellIndex, note: `${note}${noteIndex + 2}` })
                }}
              />
             ) (notes)
           ) (repeat(notes, 4))}
        </MidiColumn>
      )) (state.midiEditor.cells)}
      <PlayButton
        isPlaying={state.midiEditor.isPlaying}
        onClick={e => state.midiEditor.isPlaying
          ? dispatch({ type: 'stop_midi' })
          : dispatch({ type: 'play_midi' })
        }
      >{ state.midiEditor.isPlaying ? 'Stop': 'Play' }</PlayButton>
    </MidiGrid>
  )
}

const MidiGrid = styled.div`
  width: 100vw;
  height: auto;
  display: flex;
  flex-direction: row;
`

const MidiColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const MidiNote = styled.div`
  height: 10px;
  width: 20px;
  border: 1px solid black;
  background-color: ${props => props.active ? 'red' : 'transparent'};
`

const PlayButton = styled.button``