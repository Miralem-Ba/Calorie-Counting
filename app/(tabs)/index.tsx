import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function AboutScreen() {
  // Zustand für das Eingabefeld 'meal' (Name des Essens)
  const [meal, setMeal] = useState('');

  // Zustand für das Eingabefeld 'calories' (Kalorienangabe)
  const [calories, setCalories] = useState('');

  // Zustand für das Eingabefeld 'mealType' (Art der Mahlzeit, z.B. Frühstück, Mittagessen)
  const [mealType, setMealType] = useState('');

  // Zustand für die Liste der gespeicherten Mahlzeiten
  const [mealList, setMealList] = useState([]);

  // Funktion, die beim Klick auf 'Save Meal' ausgeführt wird
  const handleSaveMeal = () => {
    // Prüfen, ob alle Felder ausgefüllt sind
    if (meal && calories && mealType) {
      // Eine neue Mahlzeit erstellen mit zufälliger ID, Name des Essens, Kalorien und Mahlzeitentyp
      const newMeal = { id: Math.random().toString(), meal, calories, mealType };

      // Die neue Mahlzeit zur bestehenden Liste hinzufügen
      setMealList([...mealList, newMeal]);

      // Nach dem Speichern die Eingabefelder zurücksetzen
      setMeal(''); // Zurücksetzen des Eingabefeldes für das Essen
      setCalories(''); // Zurücksetzen des Kalorienfeldes
      setMealType(''); // Zurücksetzen des Mahlzeitentyps
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calories-Counting</Text>
      
      {/* Eingabefeld für den Namen der Mahlzeit */}
      <TextInput
        style={styles.input}
        placeholder="Enter your Meal"
        value={meal}
        onChangeText={setMeal} // Aktualisiert den Zustand 'meal' bei Eingabe
      />

      {/* Eingabefeld für die Kalorien der Mahlzeit */}
      <TextInput
        style={styles.input}
        placeholder="Enter your Calories"
        value={calories}
        onChangeText={setCalories} // Aktualisiert den Zustand 'calories' bei Eingabe
        keyboardType="numeric" // Setzt die Tastatur auf numerisch (nur Zahlen)
      />

      {/* Eingabefeld für den Typ der Mahlzeit (z.B. Frühstück, Mittagessen) */}
      <TextInput
        style={styles.input}
        placeholder="Enter your Meal Type"
        value={mealType}
        onChangeText={setMealType} // Aktualisiert den Zustand 'mealType' bei Eingabe
      />

      {/* Button zum Speichern der Mahlzeit */}
      <Button title="Save Meal" onPress={handleSaveMeal} />

      {/* Liste der gespeicherten Mahlzeiten anzeigen */}
      <FlatList
        data={mealList} // Die Daten, die angezeigt werden sollen (Liste der Mahlzeiten)
        keyExtractor={(item) => item.id} // Jeder Eintrag muss einen eindeutigen Schlüssel (ID) haben
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            {/* Zeigt die gespeicherte Mahlzeit, die Kalorien und den Typ der Mahlzeit an */}
            <Text style={styles.mealText}>
              {item.meal} - {item.calories} kcal - {item.mealType}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

// Styles für die App
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Hintergrundfarbe Weiß
  },
  header: {
    fontSize: 24, // Schriftgröße
    fontWeight: 'bold', // Fettdruck
    marginBottom: 16, // Abstand nach unten
    textAlign: 'center', // Text zentrieren
  },
  input: {
    borderWidth: 1, // Rahmenbreite
    borderColor: '#ccc', // Rahmenfarbe
    padding: 10, // Innenabstand
    marginBottom: 10, // Abstand nach unten
    borderRadius: 5, // Abgerundete Ecken
  },
  mealItem: {
    padding: 10, // Innenabstand
    borderBottomWidth: 1, // Unterer Rahmen für jede Mahlzeit
    borderBottomColor: '#ccc', // Rahmenfarbe für den unteren Rand
  },
  mealText: {
    fontSize: 16, // Schriftgröße
  },
});
