import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { getMIDIDevices } from '../state'
import { SynthInstrumentContext } from './Engine'

export const DeviceSelector = () => {
  const [state, dispatch] = useContext(SynthInstrumentContext)
  const [devicesValues, setDevicesValues] = useState([])
  const devices = getMIDIDevices(state)

  const onDeviceChange = useCallback(
    event => {
      const device = state.midi.devices.find(device => device.id.toString() === event.target.value.toString());

    if (!device) {
      return
    }

    dispatch({ type: 'midi_switch_device', device })
    },
    [state.midi.devices, dispatch]
  )

  useEffect(() => {
    setDevicesValues(
      devices
        .filter(device => device.state === 'connected')
        .map(device => ({label: device.name, value: device.id}) )
    )
  }, [devices])

  return (
    <Container>
      <Label>MIDI Devices</Label>
      <StyledSelector onChange={onDeviceChange}>
        <option defaultValue disabled>Choose one MIDI device</option>
        {devicesValues.map(deviceValue =>
          <option key={deviceValue.value} value={deviceValue.value}>{deviceValue.label}</option>
        )}
      </StyledSelector>
    </Container>
  );
}

const Container = styled.div`
  margin-right: 1rem;
  max-width: 200px;
  box-sizing: border-box;
`

const Label = styled.p`
  text-shadow: 0 0 4px ${props => props.theme.colors.shadows.text}, inset 0 0 4px red;
  text-transform: uppercase;
  font-style: italic;
  font-weight: bold;
`

const StyledSelector = styled.select`
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.background};
  height: 25px;
`
