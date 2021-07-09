import React from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput } from 'react-native';
import { Checkbox, Divider, Headline, Subheading } from 'react-native-paper';
import { LevelLock } from '../common/LevelLock';
import { setAgentImageReference, setAgentName, toggleAgentEnabled } from '../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Colors, Containers } from '../styles';
import { ImageReferencePicker } from './module-editor/ImageReferencePicker';

export const AdvancedSettings: React.FC = () => {

  const prototypeQuest = useAppSelector(state => state.editor.questPrototype);
  const dispatch = useAppDispatch();

  return (
    <ScrollView 
      style={{
        marginHorizontal: 20
      }}
      contentContainerStyle={{
        paddingTop: 30
      }}>
      <Headline>Advanced Settings</Headline>
      <View style={[styles.group]}>
        <LevelLock permission={{
            type: 'discrete',
            perm: 'CustomAgent'
          }}
        >
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Subheading>Custom Agent</Subheading>
          <Checkbox 
            status={prototypeQuest?.agentEnabled ? 'checked' : 'unchecked'}
            onPress={() => dispatch(toggleAgentEnabled())}
            theme={{colors: {
              accent: Colors.secondary
            }}}/>
        </View>
        <Divider />
        {prototypeQuest?.agentEnabled && <View style={{
          marginTop: 10
        }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10}}>
            <Text>Agent name</Text>
            <TextInput 
              style={styles.smallInputs} 
              placeholder='Enter Agent name' 
              defaultValue={prototypeQuest?.agentProfileName}
              onChangeText={(e) => dispatch(setAgentName(e))}></TextInput>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10}}>
            <Text>Agent profile image</Text>
            <ImageReferencePicker 
              aspect={[4, 4]} 
              style={styles.profileImage} 
              reference={prototypeQuest?.agentProfileReference} 
              setReference={(ref) => dispatch(setAgentImageReference(ref))}/>
          </View>
          
        </View>}
        </LevelLock>
      </View>

      <View style={[styles.group]}>

      <LevelLock permission={{
            type: 'discrete',
            perm: 'RelatedQuests'
          }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          
          <Subheading>Related Quests</Subheading>
          <Checkbox 
            status={'unchecked'}
            theme={{colors: {
              accent: Colors.secondary
            }}}/>
        </View>
        <Divider />
        </LevelLock>
      </View>
    </ScrollView>
  )

}

const styles = StyleSheet.create({
  group: {
    borderWidth: 1,
    borderRadius: 25,
    borderColor: Colors.gray,
    padding: 20,
    marginTop: 20,
    backgroundColor: Colors.background
  },
  smallInputs: {
    ...Containers.rounded,
    flexDirection: 'row', 
    alignItems: 'center',
    width: '49%',
    height: 50, 
    fontSize: 15, 
    paddingLeft: 15,
    backgroundColor: Colors.lightGray, 
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 60,
    zIndex: 20
  },
  disabled: {
    backgroundColor: Colors.lightGray
  }
})