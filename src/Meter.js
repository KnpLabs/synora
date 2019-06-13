import React, { useContext, useEffect } from 'react'
import {SynthInstrumentContext} from "./SynthInstrument";

export const Meter = () => {
    const [state, dispatch] = useContext(SynthInstrumentContext)

    useEffect(() => {
        const interval = setInterval(() => {
            if (!state.meter.engine) {
                return null;
            }

            dispatch({ type: 'update_meter' })
        }, 10)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div>
            <p>{state.meter ? state.meter.level : "nope"} - db</p>
        </div>
    )
}