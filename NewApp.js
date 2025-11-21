import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

import Svg, { Line, Rect, Text as SvgText, Circle, G, Defs, Marker, Path } from 'react-native-svg';

/*
// Tu auras besoin de @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fonction pour sauvegarder
const saveAntenna = async (name, data) => {
  try {
    const existingString = await AsyncStorage.getItem('saved_antennas');
    const existing = existingString ? JSON.parse(existingString) : [];
    const newEntry = { id: Date.now(), name, ...data, date: new Date() };
    await AsyncStorage.setItem('saved_antennas', JSON.stringify([...existing, newEntry]));
    Alert.alert('Succès', 'Configuration sauvegardée dans "Mon Shack"');
  } catch (e) {
    // Error saving
  }
};

*/






const AntennaVisualizer = ({ result, mode }) => {
  if (!result) return null;

  // Dimensions du canvas SVG
  const width = 350;
  const height = 180;
  const centerX = width / 2;
  const centerY = 60;
  
  // Échelle visuelle : On fixe la longueur "Cible" à 100px par branche pour l'affichage
  const baseScale = 100; 
  
  // Calcul des longueurs en pixels pour le dessin
  let measuredPx = baseScale;
  let targetPx = baseScale;

  // Si on est en mode adjuster, on recalcule l'échelle relative
  if (mode === 'adjuster') {
    // Si la mesure est plus grande, elle prend la taille max, la cible rétrécit
    // Si la mesure est plus petite, la cible prend la taille max, la mesure rétrécit
    const ratio = result.measuredLength / result.targetLength;
    
    if (ratio > 1) {
      measuredPx = baseScale; // La mesure dépasse (trop long)
      targetPx = baseScale / ratio;
    } else {
      targetPx = baseScale; // La cible est la référence
      measuredPx = baseScale * ratio; // La mesure est trop courte
    }
  }

  const needsCutting = mode === 'adjuster' && result.difference > 0;
  const needsLengthening = mode === 'adjuster' && result.difference < 0;

  return (
    <View style={styles.visualizerContainer}>
      <Text style={styles.visualizerTitle}>
        {mode === 'adjuster' ? '🔧 Adjustment Diagram' : '📐 Antenna Diagram'}
      </Text>
      
      <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        
        {/* 1. Câble Coaxial (Feedline) - Toujours au centre */}
        <Line x1={centerX} y1={centerY} x2={centerX} y2={height - 20} stroke="#333" strokeWidth="4" />
        <Line x1={centerX} y1={centerY} x2={centerX} y2={height - 20} stroke="#000" strokeWidth="4" strokeDasharray="4,2"/>

        {/* 2. Balun / Isolateur central */}
        <Rect x={centerX - 6} y={centerY - 8} width="12" height="16" fill="#2c3e50" rx="3" />

        {/* --- BRANCHE GAUCHE --- */}
        
        {/* Fil Principal (Target en Calculator, ou Mesuré en Adjuster 'Cut') */}
        <Line 
          x1={centerX} y1={centerY} 
          x2={centerX - (needsLengthening ? targetPx : measuredPx)} 
          y2={centerY} 
          stroke="#3498db" 
          strokeWidth="3" 
          strokeDasharray={needsLengthening ? "5, 3" : ""} // Pointillés si on doit rallonger (cible fantome)
        />

        {/* Si on doit couper : On dessine le fil actuel (trop long) en gris/rouge au bout */}
        {needsCutting && (
          <Line 
            x1={centerX - targetPx} y1={centerY} 
            x2={centerX - measuredPx} 
            y2={centerY} 
            stroke="#e74c3c" 
            strokeWidth="3" 
          />
        )}

        {/* Si on doit rallonger : On dessine le fil actuel (trop court) en solide par dessus les pointillés */}
        {needsLengthening && (
          <Line 
            x1={centerX} y1={centerY} 
            x2={centerX - measuredPx} 
            y2={centerY} 
            stroke="#3498db" 
            strokeWidth="3" 
          />
        )}

        {/* --- BRANCHE DROITE (Miroir) --- */}
        
        <Line 
          x1={centerX} y1={centerY} 
          x2={centerX + (needsLengthening ? targetPx : measuredPx)} 
          y2={centerY} 
          stroke="#3498db" 
          strokeWidth="3"
          strokeDasharray={needsLengthening ? "5, 3" : ""}
        />
        
        {needsCutting && (
          <Line 
            x1={centerX + targetPx} y1={centerY} 
            x2={centerX + measuredPx} 
            y2={centerY} 
            stroke="#e74c3c" 
            strokeWidth="3" 
          />
        )}

        {needsLengthening && (
          <Line 
            x1={centerX} y1={centerY} 
            x2={centerX + measuredPx} 
            y2={centerY} 
            stroke="#3498db" 
            strokeWidth="3" 
          />
        )}

        {/* --- ANNOTATIONS --- */}

        {/* Cote de longueur (Texte) */}
        <SvgText
          x={centerX + targetPx / 2}
          y={centerY - 15}
          fill="#2c3e50"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          L/4 = {result.targetLength.toFixed(3)}m
        </SvgText>

        {/* Indicateur de Coupe (Ciseaux) ou d'Ajout */}
        {needsCutting && (
          <G x={centerX + targetPx} y={centerY}>
             {/* Ligne verticale de coupe */}
             <Line x1="0" y1="-10" x2="0" y2="10" stroke="#e74c3c" strokeWidth="2" strokeDasharray="2,2" />
             <SvgText x="5" y="-15" fill="#e74c3c" fontSize="10" fontWeight="bold">Cut here</SvgText>
             <SvgText x="5" y="25" fill="#e74c3c" fontSize="10">-{result.difference.toFixed(3)}m</SvgText>
          </G>
        )}

        {needsLengthening && (
          <G x={centerX + measuredPx} y={centerY}>
             <Circle cx="0" cy="0" r="3" fill="#e74c3c" />
             <SvgText x="0" y="25" fill="#27ae60" fontSize="10" textAnchor="middle">Add {Math.abs(result.difference).toFixed(3)}m</SvgText>
          </G>
        )}

        {/* Labels Généraux */}
        <SvgText x={centerX - 80} y={height - 20} fill="#7f8c8d" fontSize="10">Coax 50Ω</SvgText>
        <Circle cx={centerX} cy={centerY} r="2" fill="white" stroke="#333" strokeWidth="1"/>
        
      </Svg>
    </View>
  );
};















const AntennaApp = () => {
  const [mode, setMode] = useState('adjuster'); // 'adjuster' or 'calculator'
  const [measuredFreq, setMeasuredFreq] = useState('');
  const [targetFreq, setTargetFreq] = useState('');
  const [velocityFactor, setVelocityFactor] = useState('0.95');
  const [result, setResult] = useState(null);
  const [units,setUnits] = useState('metric') ; 

  const calculateAntenna = () => {
    // Validation des entrées selon le mode
    const targetFreqNum = parseFloat(targetFreq.replace(',', '.'));
    const velocityFactorNum = parseFloat(velocityFactor.replace(',', '.'));
    let measuredFreqNum = null;

    if (mode === 'adjuster') {
      measuredFreqNum = parseFloat(measuredFreq.replace(',', '.'));
      if (!measuredFreqNum || !targetFreqNum || !velocityFactorNum) {
        Alert.alert('Error', 'Please enter valid numeric values');
        return;
      }
      if (measuredFreqNum <= 0) {
        Alert.alert('Error', 'Measured frequency must be positive');
        return;
      }
    } else {
      if (!targetFreqNum || !velocityFactorNum) {
        Alert.alert('Error', 'Please enter valid numeric values');
        return;
      }
    }

    if (targetFreqNum <= 0 || velocityFactorNum <= 0) {
      Alert.alert('Error', 'Values must be positive');
      return;
    }

    if (velocityFactorNum > 1) {
      Alert.alert('Error', 'Velocity factor must be ≤ 1.0');
      return;
    }

    // Constantes
    const speedOfLight = 299792458; // m/s
    
    if (mode === 'adjuster') {
      // Mode Adjuster: calcul de la différence
      const wavelengthMeasured = (speedOfLight * velocityFactorNum) / (measuredFreqNum * 1000000);
      const wavelengthTarget = (speedOfLight * velocityFactorNum) / (targetFreqNum * 1000000);
      
      const foots = 3.28084 ; 
      const lengthMeasured = wavelengthMeasured / 4;
      const lengthTarget = wavelengthTarget / 4;
      
      const difference = lengthMeasured - lengthTarget;
      
      setResult({
        mode: 'adjuster',
        measuredLength: lengthMeasured,
        targetLength: lengthTarget,
        difference: difference,
        wavelengthMeasured: wavelengthMeasured,
        wavelengthTarget: wavelengthTarget,
      });
    } else {
      // Mode Calculator: calcul simple de longueur
      const wavelengthTarget = (speedOfLight * velocityFactorNum) / (targetFreqNum * 1000000);
      const lengthTarget = wavelengthTarget / 4;
      const fullDipoleLength = wavelengthTarget / 2;
      
      setResult({
        mode: 'calculator',
        targetLength: lengthTarget,
        wavelengthTarget: wavelengthTarget,
        fullDipoleLength: fullDipoleLength,
        frequency: targetFreqNum,
      });
    }
  };

  const resetCalculation = () => {
    setMeasuredFreq('');
    setTargetFreq('');
    setVelocityFactor('0.95');
    setResult(null);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setResult(null);
    setMeasuredFreq('');
    setTargetFreq('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📡 Antenna Tool</Text>
          <Text style={styles.subtitle}>
            {mode === 'adjuster' 
              ? 'Calculate length difference between two frequencies (λ/2)'
              : 'Calculate antenna length for a specific frequency (λ/2)'
            }
          </Text>
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSection}>
          <Text style={styles.modeTitle}>Select Mode:</Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'adjuster' && styles.modeButtonActive]}
              onPress={() => switchMode('adjuster')}
            >
              <Text style={[styles.modeButtonText, mode === 'adjuster' && styles.modeButtonTextActive]}>
                🔧 Antenna Adjuster
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'calculator' && styles.modeButtonActive]}
              onPress={() => switchMode('calculator')}
            >
              <Text style={[styles.modeButtonText, mode === 'calculator' && styles.modeButtonTextActive]}>
                📏 Antenna Calculator
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.inputSection}>
          {mode === 'adjuster' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Measured Frequency (MHz)</Text>
              <TextInput
                style={styles.input}
                value={measuredFreq}
                onChangeText={setMeasuredFreq}
                placeholder="Ex: 14.200"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {mode === 'adjuster' ? 'Target Frequency (MHz)' : 'Frequency (MHz)'}
            </Text>
            <TextInput
              style={styles.input}
              value={targetFreq}
              onChangeText={setTargetFreq}
              placeholder="Ex: 14.150"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wire Velocity Factor</Text>
            <TextInput
              style={styles.input}
              value={velocityFactor}
              onChangeText={setVelocityFactor}
              placeholder="Ex: 0.95"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.calculateButton} onPress={calculateAntenna}>
            <Text style={styles.calculateButtonText}>📊 Calculate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetCalculation}>
            <Text style={styles.resetButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {result && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>📈 Results</Text>
            {/*  <AntennaVisualizer result={result} mode={mode} />    */}
            {result.mode === 'adjuster' ? (
              // Adjuster Results
              <>
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Measured wavelength:</Text>
                  <Text style={styles.resultValue}>
                    {result.wavelengthMeasured.toFixed(3)} m
                  </Text>
                </View>

                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Target wavelength:</Text>
                  <Text style={styles.resultValue}>
                    {result.wavelengthTarget.toFixed(3)} m
                  </Text>
                </View>

                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Measured branch length (λ/4):</Text>
                  <Text style={styles.resultValue}>
                    {result.measuredLength.toFixed(3)} m ({(result.measuredLength * 100).toFixed(1)} cm) ({(result.measuredLength * 3.28084).toFixed(2)} ft)
                  </Text>
                </View>

                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Target branch length (λ/4):</Text>
                  <Text style={styles.resultValue}>
                    {result.targetLength.toFixed(3)} m ({(result.targetLength * 100).toFixed(1)} cm) ( {(result.targetLength * 3.28084).toFixed(2)} ft)
                  </Text>
                </View>

                <View style={[styles.resultCard, styles.differenceCard]}>
                  <Text style={styles.resultLabel}>Length difference:</Text>
                  <Text style={[styles.resultValue, styles.differenceValue]}>
                    {result.difference > 0 ? '+' : ''}{result.difference.toFixed(4)} m,  
                    ( {result.difference > 0 ? '+' : ''}{(result.difference * 3.28084).toFixed(2)} ft) 
                  </Text>
                  <Text style={[styles.resultValue, styles.differenceValue]}>
                    ({result.difference > 0 ? '+' : ''}{(result.difference * 100).toFixed(2)} cm), 
                    ({result.difference > 0 ? '+' : ''}{(result.difference * 100/2.54).toFixed(2)} in)
                  </Text>
                  <Text style={styles.adjustmentText}>
                    {result.difference > 0 
                      ? '✂️ Shorten branches by this length' 
                      : '📏 Lengthen branches by this length'}
                  </Text>
                </View>
              </>
            ) : (
              // Calculator Results
              <>
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Frequency:</Text>
                  <Text style={styles.resultValue}>
                    {result.frequency.toFixed(3)} MHz
                  </Text>
                </View>

                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Wavelength:</Text>
                  <Text style={styles.resultValue}>
                    {result.wavelengthTarget.toFixed(3)} m
                  </Text>
                </View>

                <View style={[styles.resultCard, styles.calculatorCard]}>
                  <Text style={styles.resultLabel}>Full dipole length (λ/2):</Text>
                  <Text style={[styles.resultValue, styles.calculatorValue]}>
                    {result.fullDipoleLength.toFixed(3)} m ({(result.fullDipoleLength * 100).toFixed(1)} cm)
                  </Text>
                </View>

                <View style={[styles.resultCard, styles.calculatorCard]}>
                  <Text style={styles.resultLabel}>Each branch length (λ/4):</Text>
                  <Text style={[styles.resultValue, styles.calculatorValue]}>
                    {result.targetLength.toFixed(3)} m ({(result.targetLength * 100).toFixed(1)} cm)
                  </Text>
                </View>

                <View style={styles.resultCard}>
                  <Text style={styles.adjustmentText}>
                    📐 Cut each branch to the specified length
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Information</Text>
          {mode === 'adjuster' ? (
            <>
              <Text style={styles.infoText}>
                • This tool calculates the length difference needed to adjust a λ/2 dipole
              </Text>
              <Text style={styles.infoText}>
                • Each dipole branch measures λ/4 of the wavelength
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.infoText}>
                • This tool calculates the optimal length for a λ/2 dipole antenna
              </Text>
              <Text style={styles.infoText}>
                • Cut two branches of the calculated λ/4 length
              </Text>
            </>
          )}
          <Text style={styles.infoText}>
            • Typical velocity factor is 0.95 for most wires
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({


visualizerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden', // Important pour que le SVG ne dépasse pas
  },
  visualizerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95a5a6',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },





  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modeSection: {
    marginBottom: 25,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 0.48,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: '#3498db',
    backgroundColor: '#3498db',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  inputSection: {
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  calculateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultSection: {
    marginBottom: 25,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  differenceCard: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  calculatorCard: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  resultLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  differenceValue: {
    fontSize: 18,
    color: '#27ae60',
  },
  calculatorValue: {
    fontSize: 18,
    color: '#2196f3',
  },
  adjustmentText: {
    fontSize: 14,
    color: '#e67e22',
    fontStyle: 'italic',
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default AntennaApp;

