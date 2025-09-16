import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const heartColors = ['#ff6b6b', '#ff8e8e', '#E91E63', '#ffc0cb'];

export default function CuteLoader({ label = 'Loading...' }) {
  const hearts = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.centerBox}>
        <Animatable.Text
          animation="pulse"
          iterationCount="infinite"
          easing="ease-in-out"
          style={styles.emoji}
        >
          💖
        </Animatable.Text>
        <Text style={styles.label}>{label}</Text>
      </View>

      {hearts.map((i) => (
        <Animatable.View
          key={i}
          animation="fadeInUp"
          iterationCount="infinite"
          duration={1500 + (i % 4) * 200}
          delay={(i % 4) * 120}
          style={[styles.heart, { left: (width * (0.2 + 0.6 * Math.random())) }, { backgroundColor: heartColors[i % heartColors.length] }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 20,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  heart: {
    position: 'absolute',
    bottom: 30,
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.8,
  },
});


