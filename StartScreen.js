import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import CuteLoader from './CuteLoader';

const { width } = Dimensions.get('window');

export default function StartScreen({ onStart, onBack }) {
  const [numPlayers, setNumPlayers] = useState(4);
  const [names, setNames] = useState(() => Array.from({ length: 4 }, (_, i) => `Player ${i + 1}`));
  const [isLoading, setIsLoading] = useState(false);

  const canStart = useMemo(() => names.slice(0, numPlayers).every(n => n && n.trim().length > 0), [names, numPlayers]);

  const updateCount = async (delta) => {
    const next = Math.min(12, Math.max(2, numPlayers + delta));
    if (next === numPlayers) return;
    if (Platform.OS !== 'web') {
      await Haptics.selectionAsync();
    }
    setNumPlayers(next);
    setNames(prev => {
      const updated = [...prev];
      if (next > updated.length) {
        while (updated.length < next) {
          updated.push(`Player ${updated.length + 1}`);
        }
      }
      return updated;
    });
  };

  const updateName = (index, value) => {
    setNames(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleStart = async () => {
    if (!canStart) return;
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsLoading(true);
    setTimeout(() => {
      onStart(names.slice(0, numPlayers));
      setIsLoading(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#3F51B5', '#673AB7', '#9C27B0']} style={styles.container}>
        <View style={styles.header}>
          {onBack ? (
            <TouchableOpacity style={styles.backBtn} onPress={onBack}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.title}>Truth or Dare</Text>
          <Text style={styles.subtitle}>Set up your players</Text>
        </View>

        <View style={styles.countRow}>
          <TouchableOpacity style={[styles.countButton, styles.leftButton]} onPress={() => updateCount(-1)}>
            <Ionicons name="remove" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.countDisplay}>
            <Text style={styles.countValue}>{numPlayers}</Text>
            <Text style={styles.countLabel}>Players</Text>
          </View>
          <TouchableOpacity style={[styles.countButton, styles.rightButton]} onPress={() => updateCount(1)}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.namesList}>
          {Array.from({ length: numPlayers }).map((_, i) => (
            <View key={i} style={styles.nameRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{i + 1}</Text>
              </View>
              <TextInput
                style={styles.nameInput}
                value={names[i]}
                onChangeText={(t) => updateName(i, t)}
                placeholder={`Player ${i + 1} name`}
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity disabled={!canStart} onPress={handleStart} style={[styles.startButton, !canStart && styles.startDisabled]}>
            <Text style={styles.startText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      {isLoading && <CuteLoader label="Getting ready..." />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 0,
    padding: 8,
  },
  backText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 6,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  countButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    marginRight: 16,
  },
  rightButton: {
    marginLeft: 16,
  },
  countDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  countValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  countLabel: {
    color: 'white',
    fontSize: 12,
    opacity: 0.85,
  },
  namesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  nameInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  startButton: {
    width: width * 0.7,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ecdc4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  startDisabled: {
    opacity: 0.5,
  },
  startText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


