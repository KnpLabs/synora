# SYÑORA

A web based synthesizer using Web Audio API and Web MIDI API, Tone.js and React

## Routing

```
           /---> OSC1 ---\
Midi ---> |               |---> FILTER ---> DIST ---> DELAY ---> OUT
           \---> OSC2 ---/
```

## How to use

```shell
$ yarn install
$ yarn start
```

## TODO

 - [x] ~~Filter (type, cut, res, and ADSR)~~
 - [x] ~~Symetric knob visual feedback~~
 - [ ] Performance enhancement (extract engine from state?)
 - [ ] Presets (save to string, load from string and URL, example presets)
 - [ ] Handle velocity (MIDI and keyboard position)
 - [ ] Knob help (description and unit)
 - [ ] True polyphony
 - [ ] Reverb
 - [ ] MIDI activity indicator
 - [ ] Frequency Modulation (Osc1 <-> Osc2)
 - [ ] Tests...
