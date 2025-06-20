// AudioRecorder.js
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

type AudioRecorderProps = {
  onAudioRecorded?: (audioPath: string) => void;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({onAudioRecorded}) => {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState(null);

  const onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    setRecording(true);
    setAudioPath(result);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setRecording(false);
    setAudioPath(result);
    if (onAudioRecorded) onAudioRecorded(result); // Pass audio path back
  };

  const onStartPlay = async () => {
    if (!audioPath) return;
    await audioRecorderPlayer.startPlayer(audioPath);
    setPlaying(true);
  };

  const onStopPlay = async () => {
    await audioRecorderPlayer.stopPlayer();
    setPlaying(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={recording ? onStopRecord : onStartRecord}
          style={styles.button}>
          <Text style={styles.buttonText}>{recording ? 'Stop' : 'Record'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={playing ? onStopPlay : onStartPlay}
          style={styles.button}
          disabled={!audioPath}>
          <Text style={styles.buttonText}>
            {playing ? 'Stop Playing' : 'Play'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {fontSize: 16, marginBottom: 5},
  controls: {flexDirection: 'row', gap: 10},
  button: {
    padding: 8,
    backgroundColor: '#1f2937',
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
  },
});

export default AudioRecorder;
