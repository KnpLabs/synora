import React, { useContext } from 'react'
import styled from 'styled-components'
import { createToken, decodeToken } from '../utils/token'
import { SynthInstrumentContext } from './Engine'

export const PresetManager = () => {
  const [state, dispatch] = useContext(SynthInstrumentContext)

  const exportParameters = () => {
    prompt('', createToken(state.parameters))
  }

  const importParameters = () => {
    const token = prompt('Copy preset token here')

    dispatch({type: 'load_preset', parameters: decodeToken(token)})
  }

  return <Wrapper>
    <Button onClick={importParameters} title="Load a preset token">&#10549;</Button>
    <Button onClick={exportParameters} title="Save current settings as a preset token">&#10548;</Button>
  </Wrapper>
}

const Wrapper = styled.div`
  flex: 1;
  vertical-align: middle;
  display: flex;
  flex-direction: column;
  padding-right: 1rem;
`

const Button = styled.button`
  flex: 1;
  align-self: flex-end;
  max-width: 4rem;
  text-shadow: 0 -1px 0 ${props => props.theme.colors.shadows.text};
  border: 1px solid ${props => props.theme.colors.borders.dark};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
  box-shadow: inset 0 2px 2px ${props => props.theme.colors.shadows.lightWhite}, inset 0 -2px 2px ${props => props.theme.colors.shadows.lightBlack};

  &:first-child {
    margin-bottom: 0.25rem;
  }
;

  &:hover {
    background-color: ${props => props.theme.colors.shadows.lightWhite};
  }

  &:active {
    box-shadow: inset 0 2px 2px ${props => props.theme.colors.shadows.lightBlack}, inset 0 -2px 2px ${props => props.theme.colors.shadows.lightWhite};
  }
`
