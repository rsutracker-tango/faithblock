import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../../theme';

// Minimal inline icon set (avoid dependency issues with @expo/vector-icons)
function Icon({ name, color, size = 22 }: { name: string; color: ColorValue; size?: number }) {
  const common = { fill: 'none', stroke: color as string, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...common}>
          <Path d="M3 10.5 12 3l9 7.5" />
          <Path d="M5 9.5V21h14V9.5" />
          <Path d="M10 21v-6h4v6" />
        </Svg>
      );
    case 'pray':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...common}>
          <Path d="M12 21c-4-3.5-7-6.5-7-10a4.5 4.5 0 0 1 7-3.6A4.5 4.5 0 0 1 19 11c0 3.5-3 6.5-7 10Z" />
        </Svg>
      );
    case 'book':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...common}>
          <Path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17.5H6.5A2.5 2.5 0 0 0 4 22Z" />
          <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        </Svg>
      );
    case 'journal':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...common}>
          <Path d="M5 3h14v18H5z" />
          <Path d="M8 7h8M8 11h8M8 15h5" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" {...common}>
          <Rect x="4.5" y="10" width="15" height="10" rx="2" />
          <Path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <Path d="M12 14v3" />
        </Svg>
      );
    default:
      return <Svg width={size} height={size} viewBox="0 0 24 24" {...common}><Path d="M12 5v14M5 12h14" /></Svg>;
  }
}

function TabIcon({ name, color }: { name: string; color: ColorValue }) {
  return <Icon name={name} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.goldBright,
        tabBarInactiveTintColor: colors.ivoryDim,
        tabBarStyle: {
          backgroundColor: colors.navyDeep,
          borderTopColor: colors.navyBorder,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
      <Tabs.Screen name="pray" options={{ title: 'Pray', tabBarIcon: ({ color }) => <TabIcon name="pray" color={color} /> }} />
      <Tabs.Screen name="devotional" options={{ title: 'Devotional', tabBarIcon: ({ color }) => <TabIcon name="book" color={color} /> }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: ({ color }) => <TabIcon name="journal" color={color} /> }} />
    </Tabs>
  );
}
