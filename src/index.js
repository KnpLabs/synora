import React from 'react'
import { render } from 'react-dom'
import { SynthInstrument } from './SynthInstrument'
import { SynthController } from './SynthController'
import { Volume } from './Volume'
import { ADSR } from './ADSR'
import { Keyboard } from './Keyboard'
import { WaveshapeSelector} from './WaveshapeSelector'
import { PingPongDelay } from './PingPongDelay'
import { Distortion } from './Distortion'
import styled from 'styled-components'
import { Meter } from './Meter'

const Synth = () =>
  <Wrapper>
    <SynthInstrument>
      <Title>Syñora</Title>
      <Volume />
      <WaveshapeSelector />
      <EffectRack>
        <ADSR />
        <PingPongDelay />
        <Distortion />
        <Meter />
      </EffectRack>
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
  font-weight: bold;
`

const EffectRack = styled.div`
  display: flex;

  > * {
    flex: 1;
    clear: both;
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding: 1em;
    margin-bottom: 1rem;
    box-shadow: inset 0 -40px 40px rgba(255, 255, 255, 0.05);

    p {
      margin: -24px 0 1em 0;
      padding-left: 1em;
      background-color: #234760;
    }

    &>div {
      display: flex;
    }
  }
`

const root = document.getElementById('root')

render(<Synth />, root)
