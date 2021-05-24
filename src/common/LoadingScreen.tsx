import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import i18n from 'i18n-js';

import { commonTranslations } from './translations';

export const LoadingScreen = () => {

  i18n.translations = commonTranslations;

  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#1D79AC" />
        <Text>{i18n.t('loading')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
