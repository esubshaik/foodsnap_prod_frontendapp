import React, { useEffect } from 'react';
import { Audio, Speech, Permissions } from 'expo';

const SpeechInput = async ({ boolRecord }) => {
  const transcribeAudio = async (uri) => {
    try {
      const { transcription } = await Speech.recognizeAsync({
        uri,
        language: 'en-US',
      });

      return transcription;
    } catch (error) {
      // console.error('Error transcribing audio', error);
      return null;
    }
  };

  useEffect(() => {
    const startRecording = async () => {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      if (status !== 'granted') {
        // console.error('Permission to record audio was denied');
        return null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: false,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });

      const recordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
      };

      const recording = new Audio.Recording();

      try {
        await recording.prepareToRecordAsync(recordingOptions);
        await recording.startAsync();
      } catch (error) {
        // console.error('Failed to start recording', error);
        stopRecording();
        return null;
      }

      const stopRecording = async () => {
        try {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          const transcription = await transcribeAudio(uri);
          return transcription;
        } catch (error) {
          // console.error('Failed to stop recording', error);
          return null;
        }
      };

      return stopRecording;
    };

    if (boolRecord) {
      const stopRecording = startRecording();
      return () => {
        if (stopRecording) {
          stopRecording();
        }
      };
    }
  }, [boolRecord]);

  return null;
};

export default SpeechInput;
