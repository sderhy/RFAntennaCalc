import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const ChatContainer = () => {
  return( 
        <View
          style={{
            flex: 0.8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#aaaaff',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >Hello, world!</Text>
        </View>
  ); 
}

export default ChatContainer;
