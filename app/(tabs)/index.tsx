import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Verwenden wir für die Symbole
import * as ImagePicker from 'expo-image-picker'; // Verwenden für die Kamera

export default function AboutScreen() {
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('');
  const [mealList, setMealList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [mealExistsWarning, setMealExistsWarning] = useState(false); // Warnung für doppelte Mahlzeit
  const dailyConsumptionGoal = 2500;

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('@meals');
        if (storedMeals !== null) {
          const meals = JSON.parse(storedMeals);
          setMealList(meals);
          calculateTotalCalories(meals);
        }
      } catch (e) {
        console.error('Error loading meals from storage', e);
      }
    };
    loadMeals();
  }, []);

  const saveMealsToStorage = async (meals) => {
    try {
      await AsyncStorage.setItem('@meals', JSON.stringify(meals));
    } catch (e) {
      console.error('Error saving meals to storage', e);
    }
  };

  const calculateTotalCalories = (meals) => {
    const total = meals.reduce((acc, meal) => acc + parseInt(meal.calories, 10), 0);
    setTotalCalories(total);
    setLimitReached(total > dailyConsumptionGoal);
  };

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
        // Mahlzeit bearbeiten
        const updatedMeals = mealList.map(item =>
          item.id === editingId
            ? { ...item, meal, calories, mealType }
            : item
        );
        setMealList(updatedMeals);
        saveMealsToStorage(updatedMeals);
        calculateTotalCalories(updatedMeals);
        setEditingId(null);
      } else {
        // Neue Mahlzeit hinzufügen
        const newMeal = { id: Math.random().toString(), meal, calories, mealType };
        const updatedMeals = [...mealList, newMeal];
        setMealList(updatedMeals);
        saveMealsToStorage(updatedMeals);
        calculateTotalCalories(updatedMeals);
      }

      // Felder zurücksetzen
      setMeal('');
      setCalories('');
      setMealType('');
    }
  };

  const handleEditMeal = (id) => {
    const mealToEdit = mealList.find(item => item.id === id);
    setMeal(mealToEdit.meal);
    setCalories(mealToEdit.calories);
    setMealType(mealToEdit.mealType);
    setEditingId(id);
  };

  const handleDeleteMeal = (id) => {
    const updatedMeals = mealList.filter(item => item.id !== id);
    setMealList(updatedMeals);
    saveMealsToStorage(updatedMeals);
    calculateTotalCalories(updatedMeals);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calories-Counting</Text>

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

      <Button title={editingId ? "Update Meal" : "Save Meal"} onPress={handleSaveMeal} />

      <FlatList
        data={mealList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealText}>
              {item.meal} - {item.calories} kcal - {item.mealType}
            </Text>
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

      <Text style={styles.totalCaloriesText}>
        Total Calories: {totalCalories} kcal
      </Text>
      <Text style={styles.dailyConsumptionText}>
        Daily consumption goal: {dailyConsumptionGoal} kcal
      </Text>

      {limitReached && (
        <Text style={styles.limitWarning}>
          Warnung: Sie haben das tägliche Kalorienlimit überschritten!
        </Text>
      )}

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