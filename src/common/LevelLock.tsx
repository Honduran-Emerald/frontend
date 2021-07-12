import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { Colors } from '../styles';
import { levelLocks, unlockAll } from '../utils/levelLocks';
import { BlurView } from 'expo-blur';
import { Button, Dialog, Paragraph, Portal, Subheading } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface LevelLockProps {
  permission: {
    type: 'discrete',
    perm: string
  } | {
    type: 'quests',
    quests: number | undefined
  }
  alternative?: React.ReactNode,
  dialog?: {
    title: string,
    message: string,
  }
}

const questLevelLock = /* {
  questToLevel: (questCount: number) => questCount * (questCount - 1) / 2 + 3,
  levelToQuest: (level: number) => Math.floor((1 + Math.sqrt(8*level + 1)) / 2)
} // This one grows quadratically such that the distance between each quest cap grows by 1 */
{
  questToLevel: (questCount: number) => questCount * 2 - 3,
  levelToQuest: (level: number) => Math.floor((3 + level) / 2)
}

export const LevelLock: React.FC<LevelLockProps> = ({ children, permission, alternative, dialog }) => {

  const user = useAppSelector(state => state.authentication.user)
  const [showNoMoreQuestsDialog, setShowNoMoreQuestsDialog] = useState<boolean>(false);

  if (user && !unlockAll &&
      (permission.type === 'discrete' ? permission.perm in levelLocks && user.level < levelLocks[permission.perm]
       : permission.type === 'quests' ? permission.quests !== undefined && permission.quests + 1 > questLevelLock.levelToQuest(user.level) : false)) {
        
    return <>
      {dialog && 
      <Portal><Dialog visible={showNoMoreQuestsDialog} onDismiss={() => setShowNoMoreQuestsDialog(false)}>
        <Dialog.Title>{dialog.title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{dialog.message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button color={Colors.primary} onPress={() => setShowNoMoreQuestsDialog(false)}>OK</Button>
        </Dialog.Actions>
      </Dialog></Portal>}
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
          fontSize: 18,
          fontWeight: "bold",
          color: Colors.primaryLight,
          }} onPress={() => {setShowNoMoreQuestsDialog(true)}}>
            {permission.type === 'discrete' && permission.perm in levelLocks && levelLocks[permission.perm] < 1/0 ? `Reach level ${levelLocks[permission.perm]} to unlock` 
            : permission.type === 'quests' && permission.quests !== undefined ? `Reach level ${ questLevelLock.questToLevel(permission.quests + 1) } to create more quests`
            : 'Coming soon'}
            </Subheading>
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