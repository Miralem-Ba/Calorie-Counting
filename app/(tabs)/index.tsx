import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Verwenden wir für die Symbole
import * as ImagePicker from 'expo-image-picker'; // Verwenden für die Kamera

export default function AboutScreen() {
  // Zustand für die Mahlzeit, Kalorien, Art der Mahlzeit, Liste der Mahlzeiten, zu bearbeitende ID, Gesamtzahl der Kalorien und Kalorienlimit
  const [meal, setMeal] = useState(''); // Mahlzeit-Eingabe
  const [calories, setCalories] = useState(''); // Kalorien-Eingabe
  const [mealType, setMealType] = useState(''); // Mahlzeit-Typ-Eingabe
  const [mealList, setMealList] = useState([]); // Liste der gespeicherten Mahlzeiten
  const [editingId, setEditingId] = useState(null); // ID der zu bearbeitenden Mahlzeit
  const [totalCalories, setTotalCalories] = useState(0); // Gesamtzahl der Kalorien
  const [limitReached, setLimitReached] = useState(false); // Status für das Kalorienlimit
  const [mealExistsWarning, setMealExistsWarning] = useState(false); // Warnung für doppelte Mahlzeit
  const dailyConsumptionGoal = 2500; // Tägliches Kalorienziel

  // useEffect-Hook zum Laden der gespeicherten Mahlzeiten bei der Initialisierung
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('@meals'); // Holt gespeicherte Mahlzeiten aus AsyncStorage
        if (storedMeals !== null) {
          const meals = JSON.parse(storedMeals);
          setMealList(meals);
          calculateTotalCalories(meals); // Berechnet die Gesamtzahl der Kalorien
        }
      } catch (e) {
        console.error('Error loading meals from storage', e);
      }
    };
    loadMeals();
  }, []);

  // Funktion zum Speichern der Mahlzeiten im AsyncStorage
  const saveMealsToStorage = async (meals) => {
    try {
      await AsyncStorage.setItem('@meals', JSON.stringify(meals)); // Speichert die Mahlzeiten als JSON
    } catch (e) {
      console.error('Error saving meals to storage', e);
    }
  };

  // Funktion zur Berechnung der Gesamtkalorien und Überprüfung des Kalorienlimits
  const calculateTotalCalories = (meals) => {
    const total = meals.reduce((acc, meal) => acc + parseInt(meal.calories, 10), 0); // Summiert die Kalorien
    setTotalCalories(total);
    setLimitReached(total > dailyConsumptionGoal); // Überprüft, ob das Kalorienlimit überschritten ist
  };

  // Funktion zum Speichern der neuen oder bearbeiteten Mahlzeit
  const handleSaveMeal = () => {
    if (meal && calories && mealType) {
      // Prüfen, ob die Mahlzeit bereits existiert, außer wenn wir sie gerade bearbeiten
      const mealExists = mealList.some(item => 
        item.meal.toLowerCase() === meal.toLowerCase() && item.id !== editingId
      );

      if (mealExists) {
        // Setzt die Warnung für doppelte Mahlzeiten
        setMealExistsWarning(true);
        return; // Speichervorgang abbrechen
      }

      // Warnung zurücksetzen, wenn das Speichern erfolgreich war
      setMealExistsWarning(false);

      if (editingId) {
        // Bearbeiten einer bestehenden Mahlzeit
        const updatedMeals = mealList.map(item =>
          item.id === editingId
            ? { ...item, meal, calories, mealType }
            : item
        );
        setMealList(updatedMeals);
        saveMealsToStorage(updatedMeals);
        calculateTotalCalories(updatedMeals); // Aktualisiert die Kalorienanzahl
        setEditingId(null);
      } else {
        // Hinzufügen einer neuen Mahlzeit
        const newMeal = { id: Math.random().toString(), meal, calories, mealType };
        const updatedMeals = [...mealList, newMeal];
        setMealList(updatedMeals);
        saveMealsToStorage(updatedMeals);
        calculateTotalCalories(updatedMeals); // Aktualisiert die Kalorienanzahl
      }

      // Eingabefelder nach dem Speichern leeren
      setMeal('');
      setCalories('');
      setMealType('');
    }
  };

  // Funktion zum Bearbeiten einer vorhandenen Mahlzeit
  const handleEditMeal = (id) => {
    const mealToEdit = mealList.find(item => item.id === id); // Findet die zu bearbeitende Mahlzeit
    setMeal(mealToEdit.meal); // Füllt die Eingabefelder mit den bestehenden Werten
    setCalories(mealToEdit.calories);
    setMealType(mealToEdit.mealType);
    setEditingId(id); // Setzt die aktuelle Bearbeitungs-ID
  };

  // Funktion zum Löschen einer Mahlzeit
  const handleDeleteMeal = (id) => {
    const updatedMeals = mealList.filter(item => item.id !== id); // Filtert die zu löschende Mahlzeit heraus
    setMealList(updatedMeals);
    saveMealsToStorage(updatedMeals); // Speichert die aktualisierte Liste
    calculateTotalCalories(updatedMeals); // Aktualisiert die Kalorienanzahl
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calories-Counting</Text>

      {/* Eingabefelder für Mahlzeit, Kalorien und Art der Mahlzeit */}
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

      {/* Button zum Speichern der Mahlzeit */}
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
            <View style={styles.buttonContainer}>
              {/* Button zum Bearbeiten der Mahlzeit */}
              <TouchableOpacity onPress={() => handleEditMeal(item.id)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              {/* Button zum Löschen der Mahlzeit */}
              <TouchableOpacity onPress={() => handleDeleteMeal(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Anzeige der Gesamtanzahl der Kalorien und des täglichen Ziels */}
      <Text style={styles.totalCaloriesText}>
        Total Calories: {totalCalories} kcal
      </Text>
      <Text style={styles.dailyConsumptionText}>
        Daily consumption goal: {dailyConsumptionGoal} kcal
      </Text>

      {/* Warnung bei überschrittenem Kalorienlimit */}
      {limitReached && (
        <Text style={styles.limitWarning}>
          Warnung: Sie haben das tägliche Kalorienlimit überschritten!
        </Text>
      )}

      {/* Warnung bei doppelter Mahlzeit */}
      {mealExistsWarning && (
        <Text style={styles.limitWarning}>
          Fehler: Diese Mahlzeit ist bereits gespeichert!
        </Text>
      )}

    </View>
  );
}

// Styles für die App
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    maxWidth: 600,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
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
  totalCaloriesText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dailyConsumptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  limitWarning: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
