import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=1635890035cbba097fd5c26c8ea672a1`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const forecasts = data.list.map(entry => ({
        date: entry.dt_txt.split(' ')[0], 
        temp_min: entry.main.temp_min,
        temp_max: entry.main.temp_max,
        pressure: entry.main.pressure,
        humidity: entry.main.humidity,
      }));

      const groupedForecasts = Object.values(
        forecasts.reduce((acc, forecast) => {
          if (!acc[forecast.date]) {
            acc[forecast.date] = forecast;
          }
          return acc;
        }, {})
      );

      setWeatherData(groupedForecasts.slice(0, 5));
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Weather in your city</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={city}
          onChangeText={setCity}
        />
        <Button title="Search" onPress={handleSearch} color="#FF7F00" />
      </View>
      {loading && <ActivityIndicator size="small" color="#FF7F00" style={styles.loader} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {weatherData.length > 0 && (
        weatherData.map((item, index) => (
          <View key={index} style={styles.table}>
            <Text style={styles.tableHeader}>Date: {item.date}</Text>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.headerCell]}>Temperature</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.subHeaderCell]}>Min</Text>
              <Text style={[styles.cell, styles.subHeaderCell]}>Max</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cell}>{item.temp_min}K</Text>
              <Text style={styles.cell}>{item.temp_max}K</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell]}>Pressure</Text>
              <Text style={styles.cell}>{item.pressure} hPa</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell]}>Humidity</Text>
              <Text style={styles.cell}>{item.humidity}%</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    color: '#FF7F00',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    padding: 10,
    marginBottom: 10,
    width: '100%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    textAlign: 'center',
  },
  loader: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  table: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: '#FF7F00',
    color: '#fff',
    borderRadius: 5,
    textAlign: 'center',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#000',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
    borderColor: '#000',
    borderWidth: 1,
  },
  headerCell: {
    backgroundColor: '#D3D3D3',
    fontWeight: 'bold',
  },
  subHeaderCell: {
    backgroundColor: '#D3D3D3',
  },
});

export default WeatherApp;
