import React from 'react'
import styled from 'styled-components'

export const Knob = ({label, min, max, value, payload, onChange}) => {

  return (
    <div>
      <label>{label}</label>
      <br />
      <KnobControl type="range" min={min} max={max} value={value} onChange={event => {
        onChange(event.target.value)
      }} />
      <br />
      {payload}
    </div>
  )
}

const KnobControl = styled.input`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 60px;
  visibility: hidden;
  margin-top: 0.5em;

  &:before {
    visibility: visible;
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 16px solid gray;
    border-bottom-color: transparent;
    border-radius: 50%;

  }

  &:after {
    content: '';
    visibility: visible;
    position: absolute;
    display: block;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    background-color: orange;
    border-radius: 50%;
    left: 50%;
    margin-left: -8px;
    bottom: 0;
    transform: rotate(${props => (props.value - props.min) / (props.max - props.min) * 270 + 45}deg);
    transform-origin: 8px -14px;
  }

  &:hover:after {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    border:1px solid rgba(0, 0, 0, 0.2)
  }
`
