import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AboutScreen from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mocken von AsyncStorage, um echte Lese-/Schreibvorgänge während der Tests zu vermeiden
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)), // Mock für getItem, das standardmäßig null zurückgibt
  setItem: jest.fn(() => Promise.resolve()),     // Mock für setItem, das nichts tut
}));

// Beschreibt die Test-Suite für die AboutScreen-Komponente
describe('AboutScreen', () => {
  // Setzt vor jedem Test alle Mocks zurück, um Seiteneffekte zu vermeiden
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testet, ob die Komponente korrekt mit allen initialen Elementen gerendert wird
  it('rendert korrekt mit allen initialen Komponenten', () => {
    const { getByText, getByPlaceholderText } = render(<AboutScreen />);

    // Überprüft, ob der Haupttitel vorhanden ist
    expect(getByText('Calories-Counting')).toBeTruthy();
    // Überprüft, ob alle Eingabefelder vorhanden sind
    expect(getByPlaceholderText('Enter your Meal')).toBeTruthy();
    expect(getByPlaceholderText('Enter your Calories')).toBeTruthy();
    expect(getByPlaceholderText('Enter your Meal Type')).toBeTruthy();
    // Überprüft, ob der "Save Meal"-Button vorhanden ist
    expect(getByText('Save Meal')).toBeTruthy();
  });

  // Testet das Speichern einer Mahlzeit und ob sie in der Liste angezeigt wird
  it('speichert eine Mahlzeit und zeigt sie in der Liste an', async () => {
    const { getByPlaceholderText, getByText } = render(<AboutScreen />);

    // Simuliert die Eingabe von Text in die Eingabefelder
    fireEvent.changeText(getByPlaceholderText('Enter your Meal'), 'Pizza');
    fireEvent.changeText(getByPlaceholderText('Enter your Calories'), '800');
    fireEvent.changeText(getByPlaceholderText('Enter your Meal Type'), 'Dinner');

    // Simuliert das Drücken des "Save Meal"-Buttons
    fireEvent.press(getByText('Save Meal'));

    // Wartet, bis die neue Mahlzeit in der Liste erscheint
    await waitFor(() => {
      expect(getByText('Pizza - 800 kcal - Dinner')).toBeTruthy();
    });

    // Überprüft, ob die Gesamtkalorien aktualisiert wurden
    expect(getByText('Total Calories: 800 kcal')).toBeTruthy();
    // Überprüft, ob AsyncStorage.setItem aufgerufen wurde, um die Daten zu speichern
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  // Testet das Bearbeiten einer vorhandenen Mahlzeit
  it('bearbeitet eine vorhandene Mahlzeit', async () => {
    // Mockt AsyncStorage.getItem, um eine vorhandene Mahlzeit zurückzugeben
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve(
        JSON.stringify([{ id: '1', meal: 'Salad', calories: '200', mealType: 'Lunch' }])
      )
    );

    const { getByText, getByPlaceholderText } = render(<AboutScreen />);

    // Wartet, bis die vorhandene Mahlzeit gerendert wurde
    await waitFor(() => {
      expect(getByText('Salad - 200 kcal - Lunch')).toBeTruthy();
    });

    // Simuliert das Drücken des "Edit"-Buttons
    fireEvent.press(getByText('Edit'));

    // Simuliert die Änderung der Eingabefelder
    fireEvent.changeText(getByPlaceholderText('Enter your Meal'), 'Chicken Salad');
    fireEvent.changeText(getByPlaceholderText('Enter your Calories'), '250');
    fireEvent.changeText(getByPlaceholderText('Enter your Meal Type'), 'Lunch');

    // Simuliert das Drücken des "Update Meal"-Buttons
    fireEvent.press(getByText('Update Meal'));

    // Wartet, bis die aktualisierte Mahlzeit in der Liste erscheint
    await waitFor(() => {
      expect(getByText('Chicken Salad - 250 kcal - Lunch')).toBeTruthy();
    });

    // Überprüft, ob AsyncStorage.setItem erneut aufgerufen wurde
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  // Testet das Löschen einer Mahlzeit aus der Liste
  it('löscht eine Mahlzeit aus der Liste', async () => {
    // Mockt AsyncStorage.getItem, um eine Mahlzeit zum Löschen bereitzustellen
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve(
        JSON.stringify([
          { id: '1', meal: 'Pasta', calories: '600', mealType: 'Dinner' },
        ])
      )
    );

    const { getByText, queryByText } = render(<AboutScreen />);

    // Wartet, bis die Mahlzeit gerendert wurde
    await waitFor(() => {
      expect(getByText('Pasta - 600 kcal - Dinner')).toBeTruthy();
    });

    // Simuliert das Drücken des "Delete"-Buttons
    fireEvent.press(getByText('Delete'));

    // Wartet, bis die Mahlzeit aus der Liste entfernt wurde
    await waitFor(() => {
      expect(queryByText('Pasta - 600 kcal - Dinner')).toBeNull();
    });

    // Überprüft, ob AsyncStorage.setItem aufgerufen wurde, um die Änderungen zu speichern
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  // Testet, ob eine Warnung angezeigt wird, wenn das Kalorienlimit überschritten wird
  it('zeigt eine Warnung an, wenn das tägliche Kalorienlimit überschritten wird', async () => {
    const { getByPlaceholderText, getByText } = render(<AboutScreen />);

    // Simuliert die Eingabe einer Mahlzeit, die das Kalorienlimit überschreitet
    fireEvent.changeText(getByPlaceholderText('Enter your Meal'), 'Burger');
    fireEvent.changeText(getByPlaceholderText('Enter your Calories'), '2600');
    fireEvent.changeText(getByPlaceholderText('Enter your Meal Type'), 'Dinner');

    // Simuliert das Drücken des "Save Meal"-Buttons
    fireEvent.press(getByText('Save Meal'));

    // Wartet, bis die Warnmeldung angezeigt wird
    await waitFor(() => {
      expect(
        getByText('Warnung: Sie haben das tägliche Kalorienlimit überschritten!')
      ).toBeTruthy();
    });
  });

  // Testet, ob das Hinzufügen von doppelten Mahlzeiten verhindert wird
  it('verhindert das Hinzufügen von doppelten Mahlzeiten', async () => {
    // Mockt AsyncStorage.getItem, um eine vorhandene Mahlzeit zurückzugeben
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve(
        JSON.stringify([{ id: '1', meal: 'Soup', calories: '150', mealType: 'Lunch' }])
      )
    );

    const { getByPlaceholderText, getByText } = render(<AboutScreen />);

    // Wartet, bis die vorhandene Mahlzeit gerendert wurde
    await waitFor(() => {
      expect(getByText('Soup - 150 kcal - Lunch')).toBeTruthy();
    });

    // Versucht, dieselbe Mahlzeit erneut hinzuzufügen
    fireEvent.changeText(getByPlaceholderText('Enter your Meal'), 'Soup');
    fireEvent.changeText(getByPlaceholderText('Enter your Calories'), '200');
    fireEvent.changeText(getByPlaceholderText('Enter your Meal Type'), 'Dinner');

    // Simuliert das Drücken des "Save Meal"-Buttons
    fireEvent.press(getByText('Save Meal'));

    // Wartet, bis die Fehlermeldung angezeigt wird
    await waitFor(() => {
      expect(
        getByText('Fehler: Diese Mahlzeit ist bereits gespeichert!')
      ).toBeTruthy();
    });
  });

  // Testet, ob gespeicherte Mahlzeiten beim Start geladen werden
  it('lädt gespeicherte Mahlzeiten beim Start', async () => {
    // Definiert eine Liste von Mahlzeiten zum Mocken
    const meals = [
      { id: '1', meal: 'Oatmeal', calories: '350', mealType: 'Breakfast' },
      { id: '2', meal: 'Salad', calories: '200', mealType: 'Lunch' },
    ];
    // Mockt AsyncStorage.getItem, um die definierten Mahlzeiten zurückzugeben
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve(JSON.stringify(meals))
    );

    const { getByText } = render(<AboutScreen />);

    // Wartet, bis die Mahlzeiten gerendert wurden
    await waitFor(() => {
      expect(getByText('Oatmeal - 350 kcal - Breakfast')).toBeTruthy();
      expect(getByText('Salad - 200 kcal - Lunch')).toBeTruthy();
    });

    // Überprüft, ob die Gesamtkalorien korrekt berechnet wurden
    expect(getByText('Total Calories: 550 kcal')).toBeTruthy();
  });
});
