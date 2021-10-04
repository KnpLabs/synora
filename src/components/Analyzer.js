import React, { useContext, useEffect } from 'react'
import * as Tone from 'tone'
import { mergeColors } from '../utils/colors'
import { SynthInstrumentContext } from './Engine'
import styled from 'styled-components'
import theme from '../theme'

export const Analyzer = () => {
  const [state, dispatch] = useContext(SynthInstrumentContext)

  const screen = React.useRef(null)

  useEffect(() => {
    const clock = new Tone.Clock(() => {
      if (!state.initialized) {
        return
      }

      dispatch({ type: 'update_analyzer' })
    },
    30
    )

    clock.start()
  }, [dispatch, state.initialized])

  if (!state.analyzer) {
    return
  }

  if (screen.current) {
    const ctx = screen.current.getContext('2d')
    const dots = state.analyzer.values
    const halfHeight = screen.current.height / 2

    const a2h = amplitude => Math.max(0, amplitude + 70) / 35 * screen.current.height
    const i2w = index => (screen.current.width / dots.length) * index

    ctx.lineWidth = Math.floor(screen.current.width / dots.length)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'

    ctx.fillRect(0, 0, screen.current.width, screen.current.height)
    for (let i = 0; i <= dots.length; i++) {
      ctx.strokeStyle = mergeColors(theme.colors.accent2, theme.colors.accent3, i / dots.length)
      ctx.beginPath()
      ctx.moveTo(i2w(i), halfHeight - a2h(dots[i]))
      ctx.lineTo(i2w(i), halfHeight + a2h(dots[i]))
      ctx.stroke()
    }
  }

  return (
    <Container>
      <Screen ref={ screen }/>
    </Container>
  )
}

const Container = styled.div`
  flex: 1;
  max-width: 128px;
  margin-right: 1rem;
`

const Screen = styled.canvas`
  width: 100%;
  height: 3.5rem;
  background-color: black;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`
