import { View } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  return (
    <View className="flex-1 bg-fintech-background dark:bg-fintech-background">
      {children}
    </View>
  );
}
