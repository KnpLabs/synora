import React, {useContext, useEffect} from 'react'
import {SynthInstrumentContext} from "./SynthInstrument";
import styled from "styled-components";

export const Meter = () => {
    const [state, dispatch] = useContext(SynthInstrumentContext)

    useEffect(() => {
        const interval = setInterval(() => {
            if (!state.meter.engine) {
                return null;
            }

            dispatch({type: 'update_meter'})
        }, 10)

        return () => {
            clearInterval(interval)
        }
    }, [])

    if (!state.meter) {
        return;
    }
    return (
        <MeterLadder>
            <p>Output :</p>
            <div className="screenHolder">
                <progress className='indicator' max={100} value={state.meter ? state.meter.level : 0}/>
                <input type='range' min={-10} max={100} value={state.meter.offset} onChange={event => dispatch({type:'update_meter_offset', offset: event.target.value })}/>
            </div>
        </MeterLadder>
    )
}

const MeterLadder = styled.div`
clear: both;
  border: 1px solid rgba(127, 127, 127, 0.6);
  padding: 1em;
  margin-bottom: 1rem;

  p {
    margin: -24px 0 1em 0;
    padding-left: 1em;
    background-color: #234760;
  }

  &>div {
    display: flex;
  }
  .screenHolder {
    background-color: gray;
    width:100%;
  }
  .indicator {
    appearance: none;
    width: 100%;
  }
  .indicator[value]::-webkit-progress-value  {
  background-size: cover;
  background-image:
    linear-gradient(left,red,green),
    linear-gradient(right,green);

  border-radius: 2px; 
  background-size: 35px 20px, 100% 100%, 100% 100%;
  }
`