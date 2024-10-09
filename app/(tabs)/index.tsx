import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AboutScreen() {
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('');
  const [mealList, setMealList] = useState([]);
  const [editingId, setEditingId] = useState(null); // Zustand zum Speichern der ID der zu bearbeitenden Mahlzeit

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('@meals'); // Daten aus dem Speicher abrufen
        if (storedMeals !== null) {
          setMealList(JSON.parse(storedMeals)); // Wenn vorhanden, gespeicherte Mahlzeiten setzen
        }
      } catch (e) {
        console.error('Error loading meals from storage', e); // Fehler beim Laden
      }
    };
    loadMeals(); // Funktion aufrufen, um die gespeicherten Mahlzeiten zu laden
  }, []);

  const saveMealsToStorage = async (meals) => {
    try {
      await AsyncStorage.setItem('@meals', JSON.stringify(meals)); // Liste der Mahlzeiten speichern
    } catch (e) {
      console.error('Error saving meals to storage', e); // Fehler beim Speichern
    }
  };

  // Funktion zum Speichern einer neuen Mahlzeit oder Aktualisieren einer bestehenden
  const handleSaveMeal = () => {
    if (meal && calories && mealType) {
      if (editingId) {
        // Mahlzeit bearbeiten
        const updatedMeals = mealList.map(item =>
          item.id === editingId
            ? { ...item, meal, calories, mealType }
            : item
        );
        setMealList(updatedMeals);
        saveMealsToStorage(updatedMeals);
        setEditingId(null); // Beende den Bearbeitungsmodus
      } else {
        // Neue Mahlzeit hinzufügen
        const newMeal = { id: Math.random().toString(), meal, calories, mealType };
        const updatedMeals = [...mealList, newMeal];
        setMealList(updatedMeals);
        saveMealsToStorage(updatedMeals);
      }

      // Eingabefelder zurücksetzen
      setMeal('');
      setCalories('');
      setMealType('');
    }
  };

  // Funktion zum Bearbeiten einer Mahlzeit
  const handleEditMeal = (id) => {
    const mealToEdit = mealList.find(item => item.id === id);
    setMeal(mealToEdit.meal);
    setCalories(mealToEdit.calories);
    setMealType(mealToEdit.mealType);
    setEditingId(id); // Setze den Bearbeitungsmodus
  };

  // Funktion zum Löschen einer Mahlzeit
  const handleDeleteMeal = (id) => {
    const updatedMeals = mealList.filter(item => item.id !== id);
    setMealList(updatedMeals);
    saveMealsToStorage(updatedMeals);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calories-Counting</Text>

      {/* Eingabefelder für die Mahlzeit */}
      <TextInput
        style={styles.input}
        placeholder="Enter your Meal"
        value={meal}
        onChangeText={setMeal}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Meal Type"
        value={mealType}
        onChangeText={setMealType}
      />

      {/* Button zum Speichern oder Bearbeiten */}
      <Button title={editingId ? "Update Meal" : "Save Meal"} onPress={handleSaveMeal} />

      {/* Liste der gespeicherten Mahlzeiten */}
      <FlatList
        data={mealList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealText}>
              {item.meal} - {item.calories} kcal - {item.mealType}
            </Text>
            {/* Buttons für Bearbeiten und Löschen */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleEditMeal(item.id)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteMeal(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  mealItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealText: {
    fontSize: 16,
    flex: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});
