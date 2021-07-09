import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useAppSelector } from '../redux/hooks';
import { Colors } from '../styles';
import { levelLocks } from '../utils/levelLocks';
import { BlurView } from 'expo-blur';
import { Button, Dialog, Paragraph, Subheading } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface LevelLockProps {
  permission: string
  alternative?: React.ReactNode,
  dialog?: {
    title: string,
    message: string,
  }
}

export const LevelLock: React.FC<LevelLockProps> = ({ children, permission, alternative, dialog }) => {

  const user = useAppSelector(state => state.authentication.user)
  const [showNoMoreQuestsDialog, setShowNoMoreQuestsDialog] = useState<boolean>(false);

  if (user && (permission in levelLocks&& user.level < levelLocks[permission]
    || permission.endsWith('_quests') && (parseInt(permission.substring(0, permission.length-6)) < Math.sqrt(user.level)))) {
  
    return <>
      {dialog && <Dialog visible={showNoMoreQuestsDialog} onDismiss={() => setShowNoMoreQuestsDialog(false)}>
        <Dialog.Title>{dialog.title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{dialog.message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button color={Colors.primary} onPress={() => setShowNoMoreQuestsDialog(false)}>OK</Button>
        </Dialog.Actions>
      </Dialog>}
      {alternative ? alternative : <TouchableWithoutFeedback>
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
      </TouchableWithoutFeedback>} 
    </>
    
    
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