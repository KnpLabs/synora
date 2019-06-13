import React from 'react'
import { render } from 'react-dom'
import { SynthInstrument } from './SynthInstrument'
import { SynthController } from './SynthController'
import { Volume } from './Volume'
import { Keyboard } from './Keyboard'
import { WaveshapeSelector} from './WaveshapeSelector'
import { PingPongDelay } from './PingPongDelay'
import styled from 'styled-components'

const Synth = () =>
  <Wrapper>
    <SynthInstrument>
      <Title>Syñora</Title>
      <Volume />
      <WaveshapeSelector />
      <PingPongDelay />
      <Keyboard />
      <SynthController />
    </SynthInstrument>
  </Wrapper>

const Wrapper = styled.div`
  font-family: sans-serif;
`

const Title = styled.h1`
  margin: -16px -16px 0 -16px;
  padding: 16px;
  background-color: #2f4554;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3), inset 0 8px 16px rgba(255, 255, 255, 0.2);
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  font-style: italic;
`

const root = document.getElementById('root')

render(<Synth />, root)
