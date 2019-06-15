import React, {useContext, useEffect} from 'react'
import Tone from 'tone'
import {SynthInstrumentContext} from "./SynthInstrument";
import styled from "styled-components";

export const Waveform = () => {
    const [state, dispatch] = useContext(SynthInstrumentContext);

    const screen = React.useRef(null);

    useEffect(() => {
      const clock = new Tone.Clock(() => {
          if (!state.waveform.engine) {
            return null;
          }

          dispatch({type: 'update_waveform'})
        },
        30
      );

      clock.start();
    }, []);

    if (!state.waveform) {
        return;
    }

    if (screen.current) {
        const ctx = screen.current.getContext('2d');
        const dots = state.waveform.values;

        const a2h = (amplitude) => (amplitude + 1) / 2 * screen.current.height;
        const i2w = (index) => (screen.current.width / dots.length) * index;

        ctx.strokeStyle = '#47ff97';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';

        ctx.fillRect(0, 0, screen.current.width, screen.current.height);
        ctx.beginPath();
        ctx.moveTo(0, a2h(dots[0]));
        for (let i = 1 ; i <= dots.length - 1 ; i++) {
            ctx.lineTo(i2w(i), a2h(dots[i]));
        }
        ctx.stroke();
    }

    return (
        <WaveformContainer>
            <p>Waveform</p>
            <div>
              <div className="waveformScreen">
                  <WaveformScreen ref={screen}/>
              </div>
            </div>
        </WaveformContainer>
    )
}

const WaveformContainer = styled.div`
  flex: 2! important;
  > div {
    display: flex;
    text-align: center;
  }
  div > div {
    flex: 1
  }
`

const WaveformScreen = styled.canvas`
  width: 100%
  height: 100%;
  background-color: black;
`
