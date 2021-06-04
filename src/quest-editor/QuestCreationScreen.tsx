import React, { useState } from 'react';
import { View, StyleSheet, TextInput as TextInputNative} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors, Containers } from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from '../common/ImagePicker';

export const QuestCreationScreen = () => {
  const [questTitle, setQuestTitle] = useState<string>("");
  const [questDescription, setQuestDescription] = useState<string>("");

  return(
    <KeyboardAwareScrollView
      contentContainerStyle={style.scrollViewContentContainer}
      scrollEnabled
      viewIsInsideTabBar
      enableOnAndroid
      extraHeight={100}
    >
      <TextInput 
        placeholder='Quest Title'
        value={questTitle} 
        onChange={(text) => setQuestTitle(text.nativeEvent.text)} 
        theme={{colors: {primary: Colors.primary}}} 
        style={[style.container, style.questTitleInput]} 
      />
      <ImagePicker style={[style.container, style.imagePicker]}/>
      <View style={[style.container, style.smallInputsGroup]}>
        <View style={style.smallInputs}>
          <MaterialCommunityIcons name='map-marker' size={16} color='darkgray'/>
          <TextInputNative placeholder='location name' style={{marginLeft: 7}}/>
        </View>
        <View style={style.smallInputs}>
          <MaterialCommunityIcons name='timer' size={16} color='darkgray'/>
          <TextInputNative placeholder='est. time' style={{marginLeft: 7}}/>
        </View>
      </View>
      <MultiLineInput questDescription={questDescription} setQuestDescription={setQuestDescription}/>
      <Button theme={{colors: {primary: Colors.primary}}} icon='map-marker-plus' mode='contained' onPress={() =>{}}>Pick Location</Button>
    </KeyboardAwareScrollView>
  );
}

const MultiLineInput : React.FC<{questDescription: string, setQuestDescription: Function}> = ({questDescription, setQuestDescription}) => (
  <View style={[style.container, style.description]}>
    <TextInputNative
      multiline
      numberOfLines={15}
      style={style.descriptionInput}
      value={questDescription} 
      onChangeText={(text) => setQuestDescription(text)} 
      placeholder='QuestDescription'
    />
  </View>
)

const style = StyleSheet.create({
  container: {
    width: '80%',
    marginBottom: 20
  },
  scrollViewContentContainer: {
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  questTitleInput: {
    backgroundColor: Colors.background
  },
  imagePicker: {
    height: 180,
  },
  smallInputsGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallInputs: {
    ...Containers.rounded,
    flexDirection: 'row', 
    alignItems: 'center',
    width: '47%',
    height: 50, 
    fontSize: 15, 
    paddingLeft: 15,
    backgroundColor: Colors.lightGray, 
  },
  description: {
    height: 200
  },
  descriptionInput: {
    ...Containers.rounded,
    backgroundColor: Colors.lightGray,
    textAlignVertical: 'top',
    padding: 15,
  },
})
