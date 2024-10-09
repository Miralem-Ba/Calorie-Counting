import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function AboutScreen() {
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('');

  const handleSaveMeal = () => {
    console.log(`Meal: ${meal}, Calories: ${calories}, Meal Type: ${mealType}`);
    // Add logic to handle saving the meal (e.g., update state, save to storage, etc.)
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
});
