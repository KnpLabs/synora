export const FLT_FREQ_MIN = 20
export const FLT_FREQ_MAX = 16000

export const initialState = {
  notes: [],
  initialized: false,
  midiSignal: false,
  parameters: {
    master_vol: 0.7, // [0;1] gain

    osc1_type: 'sine', // {sine,square,triangle,sawtooth}
    osc1_vol: 0.75, // [0;1] gain
    osc1_phase: 0, // [0;360] degress
    osc1_pitch: 0, // [-24;24] semitones
    osc1_detune: 0, // [-100;100] cents
    osc1_env_atk: 0.01, // [0;1] sec
    osc1_env_dec: 0, // [0;1] sec
    osc1_env_sus: 1, // [0;1] unitless
    osc1_env_rel: 0.01, // [0;1] sec

    osc2_type: 'sine', // {sine,square,triangle,sawtooth}
    osc2_vol: 0, // [0;1] gain
    osc2_phase: 0, // [0;360] degress
    osc2_pitch: 0, // [-24;24] semitones
    osc2_detune: 0, // [-100;100] cents
    osc2_env_atk: 0.01, // [0;1] sec
    osc2_env_dec: 0, // [0;1] sec
    osc2_env_sus: 1, // [0;1] unitless
    osc2_env_rel: 0.01, // [0;1] sec

    flt_type: 'lowpass', // {highpass,lowpass,bandpass,notch}
    flt_freq: FLT_FREQ_MAX, // [20;16000] Hz
    flt_res: 0, // [0;1] unitless
    flt_env_mix: 0, // [-1;1] unitless
    flt_env_atk: 0, // [0;1] sec
    flt_env_dec: 0, // [0;1] sec
    flt_env_sus: 1, // [0;1] unitless
    flt_env_rel: 0, // [0;1] sec

    delay_wet: 0, // [0;1] unitless
    delay_time: 0, // [O;10] sec
    delay_feed: 0.5, // [O;1] unitless

    verb_wet: 0, // [0;1] unitless
    verb_time: 4, // [0;10] sec

    shft_wet: 0, // [0;1] unitless
    shft_freq: 0, // [-500;500] Hz

    dist_amt: 0, // [0;1] unitless
  },
  analyzer: {
    requesting: false,
    values: [],
  },
  midi: {
    device: null,
    devices: [],
  },
}

export const reducer = (state = initialState, action) => {
  if (!action) {
    return state
  }

  switch (action.type) {
    case 'init_engine':
      return { ...state, initialized: true }

    case 'midi_device_connect':
      return {
        ...state,
        midi: {
          ...state.midi,
          devices: state.midi.devices.find(device => device.id.toString() === action.device.id.toString()) !== undefined
            ? state.midi.devices
            : [...state.midi.devices, action.device],
        },
      }

    case 'midi_device_disconnect':
      return {
        ...state,
        midi: {
          ...state.midi,
          devices: state.midi.devices.filter(device => device.id !== action.device.id),
        },
      }

    case 'midi_switch_device':
      return {
        ...state,
        midi: {
          ...state.midi,
          device: action.device,
        },
      }

    case 'update_analyzer':
      return { ...state, analyzer: { ...state.analyzer, requesting: true } }

    case 'set_analyzer':
      return { ...state, analyzer: { requesting: false, values: action.values } }

    case 'note_pressed':
      return {
        ...state,
        notes:
          state.notes.find(note => note.note ===  action.note)
            ? state.notes.map(n => (
              n.note === action.note
                ? { ...n, isPlaying: true, triggered: false, velocity: action.velocity }
                : n
            ))
            : [ ...state.notes, { note: action.note, isPlaying: true, triggered: false, velocity: action.velocity }],
      }

    case 'note_triggered':
      return {
        ...state,
        notes:
          state.notes.map(n => (
            n.note === action.note
              ? { ...n, triggered: true }
              : n
          )),
      }

    case 'note_released':
      return {
        ...state,
        notes:
          state.notes.map(n => (
            n.note === action.note
              ? { ...n, isPlaying: false, triggered: false }
              : n
          )),
      }

    case 'set_parameter':
      return {
        ...state,
        parameters: {
          ...state.parameters,
          [action.name]: action.value,
        },
      }

    case 'midi_signal':
      return { ...state, midiSignal: action.status }

    case 'load_preset':
      return {
        ...state,
        parameters: action.parameters,
      }

    default:
      return state
  }
}

/* Selectors */
export const getParams = state => state.parameters
export const getParam = (state, name) => getParams(state)[name] || null
export const getMIDIDevices = state => state.midi.devices
export const getMIDIDevice = state => state.midi.device

/* Dispatch helpers */
export const setParam = (dispatch, name, value) => dispatch({ type: 'set_parameter', name, value })
