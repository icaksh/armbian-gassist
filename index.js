const record = require('node-record-lpcm16');
const Speaker = require('speaker-arm64');
const path = require('path');
const GoogleAssistant = require('google-assistant');
const speakerHelper = require('./speaker-helper');
const { Detector, Models } = require('@bugsounet/snowboy');
const process = require('process');
const wav = require('wav');
const fs = require('fs');

let x = 0;
const config = {
  auth: {
    keyFilePath: path.resolve(__dirname, 'client_secret.json'),
    savedTokensPath: path.resolve(__dirname, 'credentials.json'), 
  },
  conversation: {
    audio: {
      sampleRateIn: 16000,
      sampleRateOut: 24000,
    },
    lang: 'en-US',
    deviceModelId: process.env.DEVICE_MODEL_ID,
    deviceId: process.env.DEVICE_ID,
    deviceLocation: {
      coordinates: {
        latitude: process.env.LATITUDE,
        longitude: process.env.LONGITUDE,
      },
    },
  },
};

const startAudioAssistant = () => {
  if (x == 0) {
    x = 1
    const assistant = new GoogleAssistant(config.auth);
    assistant
      .on('ready', () => {
        assistant.start(config.conversation)
      })
      .on('started', startConversation)
      .on('error', (error) => {
        console.log('Assistant Error:', error);
      });
  } else { }
}

const mic = record.start({
  sampleRate: 16000,
  threshold: 0,
  recordProgram: 'arecord',
  device: process.env.MIC_HW
});

const playSound = () => {
  var file = fs.createReadStream(__dirname + '/resources/alexa.wav');
  var reader = new wav.Reader();
  reader.on('format', function (format) {
    reader.pipe(new Speaker(format));
  });
  file.pipe(reader);
}

let isDone = false;
const startConversation = (conversation) => {
  console.log('Say something!');
  playSound();
  let openMicAgain = false;
  mic.on('data', (data) => conversation.write(data));
  conversation
    .on('audio-data', (data) => {
      speakerHelper.update(data);
    })
    .on('end-of-utterance', () => record.stop())
    .on('transcription', data => { console.log('Transcription:', data.transcription, ' --- Done:', data.done); isDone = data.done; })
    .on('device-action', action => console.log('Device Action:', action))
    .on('ended', (error, continueConversation) => {
      if (error) console.log('Conversation Ended Error:', error);
      else if (continueConversation) openMicAgain = false;
      else if (!isDone) process.exit();
      else console.log('Conversation Complete');
    })
    .on('error', (error) => {
      console.log('Conversation Error:', error);
    });

  const speaker = new Speaker({
    channels: 1,
    sampleRate: config.conversation.audio.sampleRateOut,
  });
  speakerHelper.init(speaker);
  speaker
    .on('open', () => {
      console.log('Assistant Speaking');
      speakerHelper.open();
    })
    .on('close', () => {
      console.log('Assistant Finished Speaking');
      process.exit()
    });

};

const waitForHotword = () => {
  console.log("Detecting Hotword");
  const models = new Models();

  models.add({
    file: 'resources/alexa.pmdl',
    sensitivity: '0.5',
    hotwords: 'Alexa'
  })

  const detector = new Detector({
    models,
    resource: 'resources/common.res',
    audioGain: 1,
    applyFrontend: false,
  });

  detector.on('hotword', () => startAudioAssistant(mic))
  mic.pipe(detector);
};

waitForHotword();
