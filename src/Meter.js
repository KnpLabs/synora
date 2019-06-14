import React, {useContext, useEffect} from 'react'
import Tone from 'tone'
import {SynthInstrumentContext} from "./SynthInstrument";
import styled from "styled-components";
import {Knob} from "./Knob";

export const Meter = () => {
    const [state, dispatch] = useContext(SynthInstrumentContext)

    useEffect(() => {
      const clock = new Tone.Clock(() => {
          if (!state.meter.engine) {
            return null;
          }

          dispatch({type: 'update_meter'})
        },
        60
      );

      clock.start();
    }, [])

    if (!state.meter) {
        return;
    }
    return (
        <MeterLadder>
            <p>Output :</p>
            <div>
              <div className="offset">
                <Knob label={'Offset'} min={-30} max={100} value={state.meter.offset}
                      onChange={val => {dispatch({type:'update_meter_offset', offset: val })}}/>
                <div className="screenHolder">
                    <progress className='indicator' max={100} value={state.meter ? state.meter.level : 0}/>
                </div>
              </div>
            </div>
        </MeterLadder>
    )
}

const MeterLadder = styled.div`
  > div {
    display: flex;
    text-align: center;
  }
  div > div {
    flex: 1
  }
  .indicator {
    appearance: none;
    width: 100%;
  }
  progress::-webkit-progress-bar {
    background-color: #090909;
    border-radius: 0px 10px 10px 0px;
    }
  .indicator[value]::-webkit-progress-value  {
    border-radius: 0px 10px 10px 0px;
    background-size: 35px 20px, 100% 100%, 100% 100%;
    background-color: #47ff97;
    box-shadow: 0 0 8px white;
  }
`
