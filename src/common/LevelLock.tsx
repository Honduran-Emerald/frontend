import React from 'react';
import { View } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useAppSelector } from '../redux/hooks';
import { Colors } from '../styles';
import { levelLocks } from '../utils/levelLocks';
import { BlurView } from 'expo-blur';
import { Subheading } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface LevelLockProps {
  permission: string
}

export const LevelLock: React.FC<LevelLockProps> = ({ children, permission }) => {

  const user = useAppSelector(state => state.authentication.user)

  console.log((parseInt(permission.substring(0, permission.length-7)) < Math.sqrt(user!.level)), (parseInt(permission.substring(0, permission.length-6))))

  if (user && (permission in levelLocks&& user.level < levelLocks[permission]
    || permission.endsWith('_quests') && (parseInt(permission.substring(0, permission.length-6)) < Math.sqrt(user.level)))) {
    return (
      <TouchableWithoutFeedback>
        <BlurView intensity={100} tint={'default'} >
          <View style={styles.locked}>
          {children}
          </View>
        </BlurView>
        <Subheading style={{
          position: 'absolute', 
          textAlign: 'center', 
          width: '100%', 
          height: '100%', 
          textAlignVertical: 'center',
          fontSize: 20,
          color: Colors.error,
          }} onPress={() => {}}>Level too low</Subheading>
      </TouchableWithoutFeedback>
      
    )
  }

  return (
    <>{children}</>
  )
}

const styles = StyleSheet.create({
  locked: {
    opacity: 0.2
  }
})