import React from 'react'
import { render } from 'react-dom'
import { Engine } from './components/Engine'
import { Filter } from './components/Filter'
import { FrequencyShifter } from './components/FrequencyShifter'
import { Oscillator } from './components/Oscillator'
import { ParamKnob } from './components/ParamKnob'
import { PresetManager } from './components/PresetManager'
import { Reverb } from './components/Reverb'
import { SynthController } from './components/SynthController'
import { Keyboard } from './components/Keyboard'
import { Delay } from './components/Delay'
import { Distortion } from './components/Distortion'
import { DeviceSelector } from './components/DeviceSelector'
import styled, { ThemeProvider } from 'styled-components'
import theme from './theme'
import { Led } from './components/Led'

const Synth = () =>
  <ThemeProvider theme={ theme }>
    <Instrument>
      <Engine>
        <Header>
          <LeftHeader>
            <Title>|| Syñora</Title>
            <Led></Led>
            <DeviceSelector />
          </LeftHeader>
          <PresetManager />
          {/*<Analyzer/>*/}
          <ParamKnob paramName={ 'master_vol' } factor="100" min="0" max="100"/>
        </Header>
        <Rack>
          <Oscillator number="1"/>
          <Oscillator number="2"/>
          <Filter/>
        </Rack>
        <Rack>
          <Delay/>
          <Distortion/>
          <Reverb/>
          <FrequencyShifter />
        </Rack>
        <Keyboard/>
        <SynthController/>
      </Engine>
    </Instrument>
  </ThemeProvider>

const Instrument = styled.div`
  position: relative;
  width: 1200px;
  font-family: ${props => props.theme.fontFamily};
  margin: 0 auto;
  user-select: none;

  * {
    box-sizing: border-box;
  }
`

const Header = styled.header`
  display: flex;
  margin: -1rem -1rem 2rem -1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.header};
  box-shadow: 0 8px 8px ${props => props.theme.colors.shadows.lightBlack},
    inset 0 8px 16px ${props => props.theme.colors.shadows.lightWhite};
  justify-content: space-between;

  > * {
    flex: 1;
  }
`

const Title = styled.h1`
  margin: auto 0;
  text-shadow: 0 0 4px ${props => props.theme.colors.shadows.text}, inset 0 0 4px red;
  text-transform: uppercase;
  font-style: italic;
  font-weight: bold;
`

const Rack = styled.div`
  display: flex;

  > * {
    flex: 1;
    clear: both;
    border: 1px solid ${props => props.theme.colors.borders.dark};
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: inset 0 -40px 40px ${props => props.theme.colors.shadows.lightWhite};

    p {
      margin: -24px 0 1em 0;
      text-transform: uppercase;
      text-shadow: 0 -1px 0 ${props => props.theme.colors.shadows.text};
      font-size: 0.9rem;
      font-weight: bold;
    }

    > div {
      display: flex;
    }
  }
`

const LeftHeader = styled.div`
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;

  ${Title} {
    margin-right: 10px;
  }
`

const root = document.getElementById('root')

render(<Synth/>, root)
