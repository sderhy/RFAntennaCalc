import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

// 1. La fonction mathématique de conversion (à mettre hors du composant)
const toMaidenhead = (lat, lon) => {
  const y = lat + 90;
  const x = lon + 180;
  const f1 = String.fromCharCode(65 + Math.floor(x / 20));
  const f2 = String.fromCharCode(65 + Math.floor(y / 10));
  const f3 = Math.floor((x % 20) / 2);
  const f4 = Math.floor((y % 10) / 1);
  const f5 = String.fromCharCode(97 + Math.floor(((x % 2) * 24) / 2)); // minuscules
  const f6 = String.fromCharCode(97 + Math.floor(((y % 1) * 24) / 1));
  return `${f1}${f2}${f3}${f4}${f5}${f6}`;
};

// 2. Le composant à insérer dans ton UI
const LocationPanel = () => {
  const [locator, setLocator] = useState('Waiting...');
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocator('Permission Denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCoords(location.coords);
      setLocator(toMaidenhead(location.coords.latitude, location.coords.longitude));
    })();
  }, []);

  return (
    <View style={styles.locContainer}>
      <Text style={styles.locTitle}>📍 My QTH Locator</Text>
      <Text style={styles.locValue}>{locator}</Text>
      {coords && (
        <Text style={styles.coords}>
          Lat: {coords.latitude.toFixed(4)} | Lon: {coords.longitude.toFixed(4)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  locContainer: { backgroundColor: '#2c3e50', padding: 15, borderRadius: 8, marginVertical: 10, alignItems: 'center' },
  locTitle: { color: '#bdc3c7', fontSize: 12, textTransform: 'uppercase' },
  locValue: { color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: 2 },
  coords: { color: '#7f8c8d', fontSize: 10, marginTop: 5 }
});


export default  LocationPanel ;
