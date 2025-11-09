import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const MyTextArea = () => {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textarea}
        multiline
        numberOfLines={4}
        value={text}
        onChangeText={setText}
        placeholder="Tapez votre texte ici..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffaaaa',
  },
  textarea: {
    height: 100,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    textAlignVertical: 'top', // Pour que le texte commence en haut
  },
});

export default MyTextArea;
