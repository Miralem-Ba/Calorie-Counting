import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AboutScreen from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

describe('AboutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rendert korrekt mit allen initialen Komponenten', () => {
    const { getByText, getByPlaceholderText } = render(<AboutScreen />);

    expect(getByText('Calories-Counting')).toBeTruthy();
    expect(getByPlaceholderText('Enter your Meal')).toBeTruthy();
    expect(getByPlaceholderText('Enter your Calories')).toBeTruthy();
    expect(getByPlaceholderText('Enter your Meal Type')).toBeTruthy();
    expect(getByText('Save Meal')).toBeTruthy();
  });

  it('speichert eine Mahlzeit und zeigt sie in der Liste an', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<AboutScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter your Meal'), 'Pizza');
    fireEvent.changeText(getByPlaceholderText('Enter your Calories'), '800');
    fireEvent.changeText(getByPlaceholderText('Enter your Meal Type'), 'Dinner');

    fireEvent.press(getByText('Save Meal'));

    await waitFor(() => {
      expect(getByText('Pizza - 800 kcal - Dinner')).toBeTruthy();
    });

    expect(getByText('Total Calories: 800 kcal')).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('bearbeitet eine vorhandene Mahlzeit', async () => {
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve(
        JSON.stringify([{ id: '1', meal: 'Salad', calories: '200', mealType: 'Lunch' }])
      )
    );

    const { getByText, getByPlaceholderText } = render(<AboutScreen />);

    await waitFor(() => {
      expect(getByText('Salad - 200 kcal - Lunch')).toBeTruthy();
    });

    fireEvent.press(getByText('Edit'));

    fireEvent.changeText(getByPlaceholderText('Enter your Meal'), 'Chicken Salad');
    fireEvent.changeText(getByPlaceholderText('Enter your Calories'), '250');
    fireEvent.changeText(getByPlaceholderText('Enter your Meal Type'), 'Lunch');

    fireEvent.press(getByText('Update Meal'));

    await waitFor(() => {
      expect(getByText('Chicken Salad - 250 kcal - Lunch')).toBeTruthy();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('löscht eine Mahlzeit aus der Liste', async () => {
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve(
        JSON.stringify([
          { id: '1', meal: 'Pasta', calories: '600', mealType: 'Dinner' },
        ])
      )
    );

    const { getByText, queryByText } = render(<AboutScreen />);

    await waitFor(() => {
      expect(getByText('Pasta - 600 kcal - Dinner')).toBeTruthy();
    });

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(queryByText('Pasta - 600 kcal - Dinner')).toBeNull();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('zeigt eine Warnung an, wenn das tägliche Kalorienlimit überschritten wird', async () => {
    const { getByPlaceholderText, getByText } = render(<AboutScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter your Meal'), 'Burger');
    fireEvent.changeText(getByPlaceholderText('Enter your Calories'), '2600');
    fireEvent.changeText(getByPlaceholderText('Enter your Meal Type'), 'Dinner');

    fireEvent.press(getByText('Save Meal'));

    await waitFor(() => {
      expect(getByText('Warnung: Sie haben das tägliche Kalorienlimit überschritten!')).toBeTruthy();
    });
  });

  it('verhindert das Hinzufügen von doppelten Mahlzeiten', async () => {
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve(
        JSON.stringify([{ id: '1', meal: 'Soup', calories: '150', mealType: 'Lunch' }])
      )
    );

    const { getByPlaceholderText, getByText } = render(<AboutScreen />);

    await waitFor(() => {
      expect(getByText('Soup - 150 kcal - Lunch')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Enter your Meal'), 'Soup');
    fireEvent.changeText(getByPlaceholderText('Enter your Calories'), '200');
    fireEvent.changeText(getByPlaceholderText('Enter your Meal Type'), 'Dinner');

    fireEvent.press(getByText('Save Meal'));

    await waitFor(() => {
      expect(getByText('Fehler: Diese Mahlzeit ist bereits gespeichert!')).toBeTruthy();
    });
  });

  it('lädt gespeicherte Mahlzeiten beim Start', async () => {
    const meals = [
      { id: '1', meal: 'Oatmeal', calories: '350', mealType: 'Breakfast' },
      { id: '2', meal: 'Salad', calories: '200', mealType: 'Lunch' },
    ];
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve(JSON.stringify(meals))
    );

    const { getByText } = render(<AboutScreen />);

    await waitFor(() => {
      expect(getByText('Oatmeal - 350 kcal - Breakfast')).toBeTruthy();
      expect(getByText('Salad - 200 kcal - Lunch')).toBeTruthy();
    });

    expect(getByText('Total Calories: 550 kcal')).toBeTruthy();
  });
});
