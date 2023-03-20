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

## PM2
PM2 monitoring (Start -> Mic -> Detector -> Google Home Assist -> Audio -> Terminate)

1. PM2 started the app
2. Detecting wakeword/hotword
3. If wakeword/hotword detected, send your voice to Google Assistant API
4. Google Assistant will respons your voice
5. App terminated and PM2 will restart this app

I don't know the efficient way to run this app.

## systemd
The logic with systemd is same as `pm2`. You can see on `gassist.service` file

```ini
StartLimitIntervalSec=1m
StartLimitBurst=100
Restart=always
RestartSec=1
```
I use `gassist.service` run on user instance because of when the armbian rebooted, `pm2` run before `pulseaudio` run, so it will got error `Connection refused`

# How to Install
## Understanding the Documentation
This documentation is based on FreeBSD documentation (only documentation, not the apps). Shell user-prompt use `$` in codeblock and root-prompt use `#` in codeblock avoiding user confusion who directly use root account, using sudo instead of doas or vice versa.

Example

```console
# nano
```
 is equivalent with

```console
$ sudo nano or doas nano
```

## Configuration
Add all of your configuration on .env file

```ini
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

Clone this repo
```console
$ git clone https://github.com/icaksh/armbian-gassist $HOME/.config/gassist
```

Chdir to repo dir
```console
$ cd $HOME/.config/gassist
```

Install audio dependencies
```console
# apt install libmagic-dev libatlas-base-dev sox libsox-fmt-all build-essential
```

Install `alsalib` or `pulseaudio lib` for compiling backend
```console
# apt install libasound2/pulseaudio-libs-devel
```

Install `speaker-arm64` with your audio backend (example pulseaudio)
```console
$ npm install speaker-arm64 --mpg123-backend=pulse/alsa
```

Install all dependencies

```console
$ npm install
```
## Running Gassist
### systemd

Move the `gassist.service` file
```console
$ mv gassist.service $HOME/.config/systemd/user/gassist.service
```

Enable the `gassist.service`
```console
$ systemctl --user daemon-reload
$ systemctl --user enable gassist.service
$ systemctl --user start gassist.service
```

Check if `gassist.service` is running
```console
$ systemctl --user status gassist.service
● gassist.service - Google Home Assistant
     Loaded: loaded (/home/icaksh/.config/systemd/user/gassist.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2023-03-20 03:01:11 UTC; 16min ago
   Main PID: 10637 (node)
     CGroup: /user.slice/user-1000.slice/user@1000.service/gassist.service
             ├─10637 /usr/bin/node /home/icaksh/.config/gassist/index.js
             └─10645 arecord -q -r 16000 -c 1 -t wav -f S16_LE -
```
### PM2


Install `pm2`

```console
# npm install -g pm2
```

Run with `pm2`
```js 
$ pm2 start index.js
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
