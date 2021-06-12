import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles';

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  return(
    <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
      <ScrollView>
        
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  }
})