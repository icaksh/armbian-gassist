# Google Home Assistant for Armbian

I build Google Home Assistant for Armbian (S905x) based on NodeJS (because Python eating more resources)


# Getting Started

## Requirement 
For installation you need:
1. NodeJS 14 and PM2
2. Microphone and Speaker
3. Device ID and Device Model ID (Create it on Google Cloud Console)


# How it Works

PM2 monitoring (Start -> Mic -> Detector -> Google Home Assist -> Audio -> Terminate)

1. PM2 started the app
2. Detecting wakeword/hotword
3. If wakeword/hotword detected, send your voice to Google Assistant API
4. Google Assistant will respons your voice
5. App terminated and PM2 will restart this app

I don't know the efficient way to run this app.

# How to Install

## Installation

### Audio backend

Install audio dependencies
```sh
sudo apt install libmagic-dev libatlas-base-dev sox libsox-fmt-all build-essential
```

Install `alsalib` or `pulseaudio lib` for compiling backend
```sh
sudo apt install libasound2/pulseaudio-libs-devel
```

Install `speaker-arm64` with your audio backend (example pulseaudio)
```sh
npm install speaker-arm64 --mpg123-backend=pulse/alsa
```

### Gassist Armbian
Install all dependencies

```sh
npm install
```

Install `pm2`

```sh
sudo npm install -g pm2
```

## Run
Run with `pm2`
```js 
pm2 start index.js
```

# Additional Information

## Warning
This repo is only for personal use. You cannot create a commercial product with this repo because of Google Assistant Policy.

## Based
This script was based on / modified from:
- [`Endoplasmic's Google Assistant`](https://github.com/endoplasmic/google-assistant)
- [`Dabolus's NodeJS Assistant`](https://github.com/Dabolus/nodejs-assistant)

## License
Copyright (c) 2023 Palguno Wicaksono

The copyright holders grant the freedom to copy, modify, convey, adapt, and/or redistribute this work under the terms of the Massachusetts Institute of Technology License.
A copy of that license is available at [`LICENSE`](https://license.icaksh.my.id/MIT)