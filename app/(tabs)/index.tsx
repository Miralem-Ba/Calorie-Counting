import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function AboutScreen() {
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('');
  const [mealList, setMealList] = useState([]);

  const handleSaveMeal = () => {
    if (meal && calories && mealType) {
      const newMeal = { id: Math.random().toString(), meal, calories, mealType };
      setMealList([...mealList, newMeal]); // Hinzufügen der neuen Mahlzeit zur Liste
      setMeal(''); // Zurücksetzen des Eingabefeldes für das Essen
      setCalories(''); // Zurücksetzen des Kalorienfeldes
      setMealType(''); // Zurücksetzen des Mahlzeitentyps
    }
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

      <Button title="Save Meal" onPress={handleSaveMeal} />

      {/* Liste der gespeicherten Mahlzeiten anzeigen */}
      <FlatList
        data={mealList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealText}>
              {item.meal} - {item.calories} kcal - {item.mealType}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

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
  },
  mealText: {
    fontSize: 16,
  },
});
