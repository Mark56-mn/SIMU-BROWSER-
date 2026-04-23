import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AmbassadorType } from '../lib/ambassadors';

interface Props {
  type: AmbassadorType;
  size?: 'small' | 'large';
}

export function AmbassadorBadge({ type, size = 'small' }: Props) {
  const getBadgeConfig = () => {
    switch (type) {
      case 'game_dev':
        return { icon: 'game-controller', color: '#00E5FF', label: 'SIMU Dev' };
      case 'support':
        return { icon: 'help-buoy', color: '#FFD700', label: 'Support' };
      case 'announcements':
        return { icon: 'megaphone', color: '#FF4444', label: 'Official' };
      case 'community':
        return { icon: 'people', color: '#9D4EDD', label: 'Community Lead' };
      default:
        return { icon: 'checkmark-circle', color: '#00FFA3', label: 'Verified' };
    }
  };

  const config = getBadgeConfig();
  const isLarge = size === 'large';

  return (
    <View style={[styles.badge, { backgroundColor: config.color + '20', borderColor: config.color + '40' }, isLarge && styles.badgeLarge]}>
      <Ionicons name={config.icon as any} size={isLarge ? 16 : 12} color={config.color} />
      <Text style={[styles.text, { color: config.color }, isLarge && styles.textLarge]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textLarge: {
    fontSize: 12,
  }
});
