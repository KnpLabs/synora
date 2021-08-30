import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

export const Knob = ({ label, min, max, value, onChange, step = null }) => {
  const [id] = useState(Math.round(Math.random() * 100000))
  const [active, setActive] = useState(false)
  const [anchorX, setAnchorX] = useState(null)

  const setValue = useCallback(delta => {
    const normalizedDelta = step ?
      delta * Math.abs(delta) * step :
      ((max - min) / 100) * delta

    const newValue = Math.max(min, Math.min(max, value + normalizedDelta))
    onChange(Math.floor(newValue))
  }, [min, max, value, onChange, step])

  useEffect(() => {
    if (active) {
      function handleOutsideMouseup () {
        setActive(false)
      }

      document.addEventListener('mouseup', handleOutsideMouseup)
      return () => {
        document.removeEventListener('mouseup', handleOutsideMouseup)
      }
    }
  }, [active, setActive])

  useEffect(() => {
    if (active) {
      function handleOutsideMousemove (event) {
        const delta = event.pageX - anchorX
        if (delta !== 0) {
          setValue(delta / 2)
        }
        setAnchorX(event.pageX)
      }

      document.addEventListener('mousemove', handleOutsideMousemove)
      return () => {
        document.removeEventListener('mousemove', handleOutsideMousemove)
      }
    }
  }, [active, setAnchorX, setValue, anchorX])

  const click = event => {
    setActive(true)
    setAnchorX(event.pageX)
  }

  const angle = calculateAngle(value, min, max)

  return (
    <KnobWrapper
      active={active}
      onMouseDown={click}
      cursorRotation={angle}
      maskPolygonPoints={angleToMaskPolygonPoints(angle)}
      withLabel={!!label}
    >
      <KnobControl id={id} type="number" min={min} max={max} value={Math.round(value)} readOnly/>
      {label && <KnobLabel id={id} data-min={min} data-max={max}>{label}</KnobLabel>}
    </KnobWrapper>
  )
}

const calculateAngle = (value, min, max) => ((value - min) / (max - min)) * 270

const angleToMaskPolygonPoints = angle => {
  let points = [
    '50% 50%',
    '0% 100%',
  ];

  if (angle <= 90) {
    points.push(`0% ${(90 - angle) / 9 * 10}%`);
  } else {
    points.push('0% 0%');

    if (angle <= 180) {
      points.push(`${(angle - 90) / 9 * 10}% 0%`);
    } else {
      points.push('100% 0%');

      points.push(`100% ${(angle - 180) / 9 * 10}%`);
    }
  }
  return points.join(', ')
}

const KnobWrapper = styled.div`
  width: 3.5rem;
  max-width: 3.5rem;
  height: 3.5rem;
  position: relative;
  border: 0.25rem solid ${props => props.theme.colors.grey};
  border-bottom-color: transparent;
  border-radius: 50%;
  margin: 0 auto ${props => props.withLabel ? '2rem' : '0'};
  user-select: none;
  text-align: center;
  cursor: ew-resize;
  box-shadow: 0 -2px 0 ${props => props.theme.colors.shadows.lightBlack};

  &:after {
    content: '';
    position: absolute;
    left: -0.25rem;
    right: -0.25rem;
    top: -0.25rem;
    bottom: -0.25rem;
    z-index: 1;
    border-radius: 50%;
    border: 0.25rem solid ${props => props.theme.colors.accent3};
    clip-path: polygon(${props => props.maskPolygonPoints});
  }

  &:before {
    content: '';
    position: absolute;
    border-right: 0.3rem solid ${props => props.active ? props.theme.colors.accent1 : props.theme.colors.grey};
    border-top: 0.3rem solid transparent;
    border-bottom: 0.3rem solid transparent;
    top: calc(50% - 0.3rem);
    left: 0.125rem;
    transform-origin: 1.375rem 0.3rem;
    transform: rotate(${props => props.cursorRotation - 45}deg);
  }
`

const KnobLabel = styled.label`
  display: inline-block;
  position: absolute;
  bottom: -2rem;
  left: 0;
  width: 100%;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text};
  text-shadow: 0 -1px 0 ${props => props.theme.colors.shadows.text};

  &:before,
  &:after {
    top: 0;
    position: absolute;
    font-size: 0.7rem;
    margin-top: -1rem;
    color: ${props => props.theme.colors.text};
    opacity: 0.75;
  }

  &:before {
    content: attr(data-min);
    left: -0.25rem;
  }

  &:after {
    content: attr(data-max);
    right: -0.25rem;
  }
`

const KnobControl = styled.input`
  appearance: none;
  z-index: 2;
  display: inline-block;
  color: ${props => props.theme.colors.text};
  padding: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  border: .4rem solid black;
  border-radius: 50%;
  background: transparent;
  outline: none;
  user-select: none;
  pointer-events: none;
  box-shadow: inset 0 2px 2px ${props => props.theme.colors.shadows.lightWhite}, inset 0 -2px 2px ${props => props.theme.colors.shadows.lightBlack};

  ${KnobWrapper}:hover & {
    background-color: ${props => props.theme.colors.shadows.lightWhite};
  }

  &::selection {
     background: transparent;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`
