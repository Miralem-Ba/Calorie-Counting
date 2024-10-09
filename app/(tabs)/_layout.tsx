import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // Benutzerdefinierte Komponente für Tab-Symbole
import { Colors } from '@/constants/Colors'; // Farben, abhängig vom Theme
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook zur Bestimmung des aktuellen Farbschemas (hell/dunkel)

export default function TabLayout() {
  // Bestimmt das Farbthema (light oder dark) des Benutzers
  const colorScheme = useColorScheme();

  return (
    // Tabs-Komponente von expo-router für die Navigation zwischen verschiedenen Bildschirmen
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // Setzt die Farbe des aktiven Tabs basierend auf dem aktuellen Farbthema
        headerShown: false, // Blendet den Header aus
      }}>
      
      {/* Bildschirmkonfiguration für den Home-Tab */}
      <Tabs.Screen
        name="index" // Name der Route (index bedeutet normalerweise die Hauptseite/Home)
        options={{
          title: 'Home', // Titel des Tabs
          tabBarIcon: ({ color, focused }) => (
            // Zeigt ein Symbol für den Tab, das je nach Fokuszustand wechselt (ausgefüllt oder umrandet)
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />

      {/* Bildschirmkonfiguration für den Explore-Tab */}
      <Tabs.Screen
        name="explore" // Name der Route (Explore-Bereich)
        options={{
          title: 'Explore', // Titel des Tabs
          tabBarIcon: ({ color, focused }) => (
            // Zeigt ein Symbol für den Tab, das je nach Fokuszustand wechselt (ausgefüllt oder umrandet)
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
