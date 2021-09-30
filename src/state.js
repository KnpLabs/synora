import { append, assoc, compose, find, ifElse, map, propEq, when } from 'ramda'

export const FLT_FREQ_MIN = 20
export const FLT_FREQ_MAX = 16000

export const initialState = {
  notes: [],
  initialized: false,
  parameters: {
    master_vol: 0.7, // [0;1] gain

    osc1_type: 'sine', // {sine,square,triangle,sawtooth}
    osc1_vol: 1, // [0;1] gain
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

    dist_amt: 0, // [0;1] unitless
  },
  analyzer: {
    requesting: false,
    values: [],
  }
}

export const reducer = (state = initialState, action) => {
  if (!action) {
    return state
  }

  switch (action.type) {
    case 'init_engine':
      return { ...state, initialized: true }

    case 'update_analyzer':
      return { ...state, analyzer: { ...state.analyzer, requesting: true }}

    case 'set_analyzer':
      return { ...state, analyzer: { requesting: false, values: action.values } }

    case 'note_pressed':
      return {
        ...state,
        notes: ifElse(
          find(propEq('note', action.note)),
          map(when(
            propEq('note', action.note),
            compose(assoc('isPlaying', true), assoc('triggered', false)),
          )),
          append({ note: action.note, isPlaying: true, triggered: false }),
        )(state.notes),
      }

    case 'note_triggered':
      return {
        ...state,
        notes: map(when(
          propEq('note', action.note),
          assoc('triggered', true),
        ))(state.notes),
      }

    case 'note_released':
      return {
        ...state,
        notes: map(when(
          propEq('note', action.note),
          compose(assoc('isPlaying', false), assoc('triggered', false)),
        ))(state.notes),
      }

    case 'set_parameter':
      return {
        ...state,
        parameters: {
          ...state.parameters,
          [action.name]: action.value,
        }
      }

    default:
      return state
  }
}

/* Selectors */
export const getParams = state => state.parameters
export const getParam = (state, name) => getParams(state)[name] || null

/* Dispatch helpers */
export const setParam = (dispatch, name, value) => dispatch({ type: 'set_parameter', name, value })
