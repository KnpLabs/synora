import React, {useContext, useEffect} from 'react'
import {SynthInstrumentContext} from "./SynthInstrument";
import styled from "styled-components";
import {Knob} from "./Knob";

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
            <Knob label={'Offset'} min={-30} max={100} value={state.meter.offset}
                  onChange={val => {dispatch({type:'update_meter_offset', offset: val })}}/>
            <div className="screenHolder">
                <progress className='indicator' max={100} value={state.meter ? state.meter.level : 0}/>
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
  .indicator {
    appearance: none;
    width: 100%;
  }
  progress::-webkit-progress-bar {
    background-color:white;
    border-radius: 0px 10px 10px 0px;
    }
  .indicator[value]::-webkit-progress-value  {
    border-radius: 0px 10px 10px 0px;
    background-size: 35px 20px, 100% 100%, 100% 100%;
  }
`
