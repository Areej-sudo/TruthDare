import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function MainScreen({ onPlay, onOpenSettings }) {
  const handlePlay = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPlay();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9C27B0" />
      <LinearGradient colors={["#9C27B0", "#673AB7", "#3F51B5"]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Truth or Dare</Text>
          <Text style={styles.subtitle}>Fun party game for everyone</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.primaryButton, styles.shadow]} onPress={handlePlay}>
            <Text style={styles.primaryText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryButton]} onPress={onOpenSettings}>
            <Text style={styles.secondaryText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  actions: {
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButton: {
    width: '70%',
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
  },
  secondaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


