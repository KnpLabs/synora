import React, { useContext } from 'react'
import styled from 'styled-components'
import { getParam, setParam } from '../../state'
import { SynthInstrumentContext } from '../Engine'

export const Selector = ({ paramName, types, ...attrs }) => {
  const [state, dispatch] = useContext(SynthInstrumentContext)

  return <StyledSelector { ...attrs }>
    {Object.keys(types).map(type =>
      <Type
        key={ type }
        className={ [type, type === getParam(state, paramName) && 'selected'].join(' ') }
        value={ type }
        label={ types[type] }
        onSelect={ val => setParam(dispatch, paramName, val) }
      />
    )}
  </StyledSelector>
}

const Type = ({ value, label, onSelect, ...attrs }) => {
  return <StyledType
    { ...attrs }
    onClick={ () => onSelect(value) }
    title={ label }>
    {label}
  </StyledType>
}

const StyledSelector = styled.div`
  background-color: ${props => props.theme.colors.background};
`

const StyledType = styled.button`
  border: 1px solid ${props => props.theme.colors.borders.dark};
  outline: none;
  font-family: ${props => props.theme.fontFamily};
  width: 2.5rem;
  height: 1.5rem;
  color: ${props => props.theme.colors.text};
  background-color: transparent;

  &.selected {
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.accent2} 0%,
      ${props => props.theme.colors.accent3} 100%);
  }

  :hover:not(.selected) {
    background-color: ${props => props.theme.colors.shadows.lightWhite};
  }

  & + & {
    border-left: 0;
  }
  &:first-child {
    border-radius: 2px 0 0 2px;
  }
  &:last-child {
    border-radius: 0 2px 2px 0;
  }
`
