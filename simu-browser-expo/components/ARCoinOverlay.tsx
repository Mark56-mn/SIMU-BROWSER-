import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface Props {
  amount: number;
  position: { x: number, y: number } | null;
  animatingTransfer: boolean;
}

export function ARCoinOverlay({ amount, position, animatingTransfer }: Props) {
  const overlayScale = useSharedValue(0.2);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (position && !animatingTransfer) {
      overlayScale.value = withSpring(1);
      opacity.value = withTiming(1, { duration: 300 });
    } else if (animatingTransfer) {
      // Transfer Animation: Flies up and shrinks into receiver phone
      translateY.value = withTiming(-600, { duration: 600 });
      overlayScale.value = withTiming(0.2, { duration: 600 });
      opacity.value = withTiming(0, { duration: 600 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [position, animatingTransfer]);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: (position?.x || 0) - 60 },
      { translateY: (position?.y || 0) - 60 + translateY.value },
      { scale: overlayScale.value }
    ]
  }));

  if (!position && !animatingTransfer) return null;

  return (
    <Animated.View style={[styles.coinContainer, animatedStyles]}>
      <View style={styles.coin}>
        <Text style={styles.coinText}>{amount}</Text>
        <Text style={styles.simuText}>SIMU</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  coinContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  coin: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    borderWidth: 4,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  coinText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  simuText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
    opacity: 0.8,
  }
});
