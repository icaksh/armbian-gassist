# Google Home Assistant for Armbian

I build Google Home Assistant for Armbian (S905x) based on NodeJS (because Python eating more resources)
![Screenshot_20230312_034939](https://user-images.githubusercontent.com/19889081/224534942-db2ca585-6c72-4b9b-a0bf-758e10d5451e.png)
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

## Configuration
Add all of your configuration on .env file

```console
DEVICE_ID=YOUR_DEVICE_ID // Obtained from GCP
DEVICE_MODEL_ID=YOUR_DEVICE_MODEL_ID // Obtained from GCP
LATITUDE=YOUR_LATITUDE //
LONGITUDE=YOUR_LONGITUDE // 
MIC_HW='plughw:1,0'
```

For MIC_HW, you can get from `arecord` command
```console
$ arecord -l
card 1: Device [USB PnP Sound Device], device 0: USB Audio [USB Audio]
  Subdevices: 0/1
  Subdevice # 350: subdevice #350
```

You can see is the card number is 1 and device is 0 so your plughw is `plughw:1,0`

## Installation

### Audio backend

Install audio dependencies
```console
sudo apt install libmagic-dev libatlas-base-dev sox libsox-fmt-all build-essential
```

Install `alsalib` or `pulseaudio lib` for compiling backend
```console
sudo apt install libasound2/pulseaudio-libs-devel
```

Install `speaker-arm64` with your audio backend (example pulseaudio)
```console
npm install speaker-arm64 --mpg123-backend=pulse/alsa
```

### Gassist Armbian
Install all dependencies

```console
npm install
```

Install `pm2`

```console
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
