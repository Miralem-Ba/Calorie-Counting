import { Link, Stack } from 'expo-router'; // Importiert Link und Stack für die Navigation
import { StyleSheet } from 'react-native'; // Importiert StyleSheet für die Gestaltung

import { ThemedText } from '@/components/ThemedText'; // Importiert ThemedText-Komponente, um themenbasierte Texte zu verwenden
import { ThemedView } from '@/components/ThemedView'; // Importiert ThemedView-Komponente, um themenbasierte Ansichten zu verwenden

// Die NotFoundScreen-Komponente wird exportiert
export default function NotFoundScreen() {
  return (
    <>
      {/* Stack.Screen dient zum Festlegen der Optionen für diesen Stack-Bildschirm */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      
      {/* ThemedView verwendet für eine themenbasierte Ansicht mit dem definierten Stil */}
      <ThemedView style={styles.container}>
        {/* ThemedText wird verwendet, um einen themenbasierten Text mit einem "title"-Stil zu zeigen */}
        <ThemedText type="title">This screen doesn't exist.</ThemedText>

        {/* Link-Komponente, um den Benutzer auf die Startseite weiterzuleiten */}
        <Link href="/" style={styles.link}>
          {/* ThemedText wird für den Link-Text verwendet */}
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

// Stile für die NotFoundScreen-Komponente
const styles = StyleSheet.create({
  container: {
    flex: 1, // Füllt den gesamten verfügbaren Platz
    alignItems: 'center', // Zentriert den Inhalt horizontal
    justifyContent: 'center', // Zentriert den Inhalt vertikal
    padding: 20, // Füge einen Innenabstand von 20px hinzu
  },
  link: {
    marginTop: 15, // Abstand oben vom Link
    paddingVertical: 15, // Vertikaler Innenabstand innerhalb des Links
  },
});
