import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#121212', borderBottomWidth: 1, borderBottomColor: '#222' },
        headerTintColor: '#00FFA3',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#121212', borderTopWidth: 1, borderTopColor: '#222' },
        tabBarActiveTintColor: '#00FFA3',
        tabBarInactiveTintColor: '#888',
      }}>
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <Ionicons name="game-controller" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dapps"
        options={{
          title: 'dApps',
          tabBarIcon: ({ color }) => <Ionicons name="apps" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="group/[id]"
        options={{
          href: null,
          title: 'Group Chat',
          tabBarStyle: { display: 'none' }
        }}
      />
    </Tabs>
  );
}
