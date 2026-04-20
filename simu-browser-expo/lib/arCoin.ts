// Mocks for Web Preview
// In a real Expo build, use: import { useFrameProcessor } from 'react-native-vision-camera';
import { useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

export const useHandTracker = () => {
  const [palmPosition, setPalmPosition] = useState<Point | null>(null);

  // Simulated Frame Processor Logic mapping coordinates to screen
  const processFrame = useCallback((frame: any) => {
    'worklet'; // Marks for runOnJS if using Reanimated

    // ML Kit or Vision Camera Frame Processing would go here.
    // E.g.: Const hands = findHands(frame); 
    // const palm = hands[0]?.palm;

    // We simulate a static hand finding here for the UI fallback
    // In production, this constantly triggers setPalmPosition correctly
  }, []);

  return { 
    palmPosition, 
    setPalmPosition, // Exposed for simulated drag-events during dev fallback
    processFrame 
  };
};
