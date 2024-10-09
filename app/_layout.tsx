import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// Importiert das DarkTheme und DefaultTheme aus der Navigationsbibliothek
import { useFonts } from 'expo-font'; // Ermöglicht die Verwendung von benutzerdefinierten Schriftarten
import { Stack } from 'expo-router'; // Stack-Navigation für verschiedene Bildschirme in der App
import * as SplashScreen from 'expo-splash-screen'; // Verwaltet das Splash-Screen-Verhalten
import { useEffect } from 'react'; // React Hook für Seiten-Effekte
import 'react-native-reanimated'; // Reanimated-Bibliothek für flüssige Animationen

import { useColorScheme } from '@/hooks/useColorScheme'; // Hook, um das aktuelle Farbschema (hell/dunkel) zu bestimmen

// Verhindert, dass der Splash-Screen automatisch ausgeblendet wird, bevor alle Assets geladen sind
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Verwendet das aktuelle Farbschema des Benutzers (entweder 'dark' oder 'light')
  const colorScheme = useColorScheme();

  // Laden der benutzerdefinierten Schriftarten (in diesem Fall die "SpaceMono" Schriftart)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Effekt, um den Splash-Screen auszublenden, sobald die Schriftarten geladen sind
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Sobald alle Assets geladen sind, wird der Splash-Screen ausgeblendet
    }
  }, [loaded]); // Abhängig von der "loaded"-Variable, also wird dieser Effekt nur dann ausgeführt, wenn die Schriftarten geladen sind

  // Wenn die Schriftarten nicht geladen sind, wird "null" zurückgegeben, sodass der Bildschirm nichts anzeigt
  if (!loaded) {
    return null;
  }

  return (
    // Stellt den ThemeProvider bereit, um je nach Farbschema das passende Theme anzuwenden (DarkTheme oder DefaultTheme)
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Stack-Navigation für die Bildschirme der App */}
      <Stack>
        {/* Haupt-Stack-Bildschirm (tabs) ohne Header */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Fallback-Bildschirm, falls eine Route nicht gefunden wird */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
