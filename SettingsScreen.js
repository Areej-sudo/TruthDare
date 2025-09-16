import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen({ onBack, onUpdatePlayers, players, scores }) {
  const [editingPlayers, setEditingPlayers] = useState(players);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tempName, setTempName] = useState('');

  const handleEditPlayer = (index) => {
    setEditingIndex(index);
    setTempName(editingPlayers[index]);
  };

  const handleSavePlayer = () => {
    if (tempName.trim()) {
      const newPlayers = [...editingPlayers];
      newPlayers[editingIndex] = tempName.trim();
      setEditingPlayers(newPlayers);
      onUpdatePlayers(newPlayers);
    }
    setEditingIndex(-1);
    setTempName('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setTempName('');
  };

  const resetScores = () => {
    Alert.alert(
      "Reset Scores",
      "Are you sure you want to reset all scores?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => {
            const newScores = new Array(editingPlayers.length).fill(0);
            onUpdatePlayers(editingPlayers, newScores);
            Alert.alert("Scores Reset", "All scores have been reset to 0!");
          }
        }
      ]
    );
  };

  const addPlayer = () => {
    const newPlayerName = `Player ${editingPlayers.length + 1}`;
    const newPlayers = [...editingPlayers, newPlayerName];
    const newScores = [...scores, 0];
    setEditingPlayers(newPlayers);
    onUpdatePlayers(newPlayers, newScores);
  };

  const removePlayer = (index) => {
    if (editingPlayers.length <= 2) {
      Alert.alert("Cannot Remove Player", "You need at least 2 players to play the game!");
      return;
    }
    
    Alert.alert(
      "Remove Player",
      `Are you sure you want to remove ${editingPlayers[index]}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            const newPlayers = editingPlayers.filter((_, i) => i !== index);
            const newScores = scores.filter((_, i) => i !== index);
            setEditingPlayers(newPlayers);
            onUpdatePlayers(newPlayers, newScores);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Names</Text>
            {editingPlayers.map((player, index) => (
              <View key={index} style={styles.playerItem}>
                {editingIndex === index ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={tempName}
                      onChangeText={setTempName}
                      placeholder="Enter player name"
                      autoFocus
                    />
                    <TouchableOpacity 
                      style={styles.saveButton} 
                      onPress={handleSavePlayer}
                    >
                      <Text style={styles.saveButtonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton} 
                      onPress={handleCancelEdit}
                    >
                      <Text style={styles.cancelButtonText}>✗</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.playerRow}>
                    <Text style={styles.playerName}>{player}</Text>
                    <Text style={styles.playerScore}>Score: {scores[index]}</Text>
                    <TouchableOpacity 
                      style={styles.editButton} 
                      onPress={() => handleEditPlayer(index)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Options</Text>
            
            <TouchableOpacity style={styles.optionButton} onPress={resetScores}>
              <Text style={styles.optionButtonText}>Reset All Scores</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={addPlayer}>
              <Text style={styles.optionButtonText}>Add New Player</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={() => removePlayer(editingPlayers.length - 1)}>
              <Text style={styles.optionButtonText}>Remove Last Player</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>
              Truth or Dare App v1.0.0{'\n'}
              Built with React Native and Expo{'\n'}
              Cross-platform support for Android and Web
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  playerScore: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4ecdc4',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  optionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
