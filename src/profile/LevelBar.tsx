import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Containers } from '../styles';

export const LevelBar = ({level, xp} : {level: number, xp: number}) => (
  <View style={styleLevelBar.outer}>
    <View style={styleLevelBar.labels}>
      <Text style={{fontWeight: 'bold'}}>
        {'Lvl ' + level}
      </Text>
      <Text style={{fontWeight: 'bold'}}>
        {(xp - getXpForNextLevel(level-1)) + '/' + (getXpForNextLevel(level) - getXpForNextLevel(level-1))}
      </Text>
    </View>
    <View style={styleLevelBar.levelBar}>
      <LinearGradient
        colors={['#1D79AC', '#40A9B8']}
        style={[styleLevelBar.levelProgress, {maxWidth: Math.min((xp - getXpForNextLevel(level-1)) / (getXpForNextLevel(level) - getXpForNextLevel(level-1)) * 100, 100) + '%'}]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  </View>
)

function getXpForNextLevel(currentLevel : number) : number {
  return 250 * (currentLevel + 9.5) * (currentLevel + 9.5) - 22562.5; 
}

const styleLevelBar = StyleSheet.create({
  outer: {
    flex: 1,
    width: '80%',
    marginTop: 20,
    alignSelf: 'center',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '98.5%', 
    alignSelf: 'center'
  },
  levelBar: {
    width: '100%',
    height: 18,
    backgroundColor: Colors.gray,
    ...Containers.rounded
  },
  levelProgress: {
    flex: 1,
    ...Containers.rounded
  }
})