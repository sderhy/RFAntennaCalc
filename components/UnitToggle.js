import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

function UnitToggle({isMetric, onChange }) {

  const toggle = (value) => {
    onChange(value); // Le parent gère l'état, on lui envoie juste le booléen
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Measurement units :</Text>
      <Text style={styles.info}> Imperial </Text>
      <Switch
      value={isMetric}
      onValueChange={toggle}
      trackColor={{ false: '#bdc3c7', true: '#bdc3c7' }}  // Gris neutre
      thumbColor={isMetric ? '#2c3e50' : '#7f8c8d'}       // Juste 2 nuances de gris

/>
      <Text style={styles.info}> Metric </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  info: { marginRight: 8 },
  label: {
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: '600',
    color: '#34495e',
    marginRight: 15
  },
});

export default UnitToggle;

