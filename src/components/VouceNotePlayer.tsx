// VoiceNotePlayer.js
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

interface VoiceNotePlayerProps {
  audioPath: string;
}

const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({audioPath}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    if (isPlaying) {
      await audioRecorderPlayer.stopPlayer();
      setIsPlaying(false);
    } else {
      await audioRecorderPlayer.startPlayer(audioPath);
      setIsPlaying(true);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.current_position >= e.duration) {
          setIsPlaying(false);
          audioRecorderPlayer.stopPlayer();
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        <Text style={styles.playText}>{isPlaying ? '⏸ Pause' : '▶️ Play'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginTop: 10},
  playButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  playText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VoiceNotePlayer;
