import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Svg, { Line, Rect, Text as SvgText, Circle, G, Defs, Marker, Path } from 'react-native-svg';

// SVG Canvas
const AntennaVisualizer = ({ result, mode, unit }) => {
  if (!result) return null;

  // Dimensions du canvas SVG
  const width = 350;
  const height = 180;
  const centerX = width / 2;
  const centerY = 60;
  
  // Échelle visuelle : On fixe la longueur "Cible" à 100px par branche pour l'affichage
  const baseScale = 120; 
  
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
          y={centerY - 36}
          fill="#2c3e50"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          L/4 = {result.targetLength.toFixed(3)}{result.unit}
        </SvgText>

        {/* Indicateur de Coupe (Ciseaux) ou d'Ajout */}
        {needsCutting && (
          <G x={centerX + targetPx} y={centerY}>
             {/* Ligne verticale de coupe */}
             <Line x1="0" y1="-10" x2="0" y2="10" stroke="#e74c3c" strokeWidth="2" strokeDasharray="2,2" />
             <SvgText x="5" y="-15" fill="#e74c3c" fontSize="12" fontWeight="bold">Cut here</SvgText>
             <SvgText x="5" y="25" fill="#e74c3c" fonSize="12" fontWeight="bold">-{result.difference.toFixed(3)} {result.unit} </SvgText>
          </G>
        )}

        {needsLengthening && (
          <G x={centerX + measuredPx} y={centerY}>
             <Circle cx="0" cy="0" r="3" fill="#e74c3c" />
             <SvgText x="-20" y="25" fill="#27ae60" fontSize="14" textAnchor="middle">Add  {Math.abs(result.difference).toFixed(3)}{result.unit}</SvgText>
          </G>
        )}

        {/* Labels Généraux */}
        <SvgText x={centerX - 80} y={height - 20} fill="#7f8c8d" fontSize="10">Coax 50Ω</SvgText>
        <Circle cx={centerX} cy={centerY} r="2" fill="white" stroke="#333" strokeWidth="1"/>
        
      </Svg>
    </View>
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
});

export default AntennaVisualizer ;
