import React, { useState } from 'react';
import { View, StyleSheet, TextInput as TextInputNative} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors, Containers } from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from '../common/ImagePicker';
import { createQuestRequest } from '../utils/requestHandler';
import { useRoute } from '@react-navigation/core';

export const QuestCreationScreen = () => {
  const [questTitle, setQuestTitle] = useState<string>("");
  const [image, setImage] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [questDescription, setQuestDescription] = useState<string>("");

  const route : {params: {latitude: number, longitude: number}} = useRoute<{params: {latitude: number, longitude: number}, key: string, name: string}>();

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
      <ImagePicker image={image} setImage={setImage} style={[style.container, style.imagePicker]}/>
      <View style={[style.container, style.smallInputsGroup]}>
        <View style={style.smallInputs}>
          <MaterialCommunityIcons name='map-marker' size={16} color='darkgray'/>
          <TextInputNative placeholder='location name' value={locationName} onChangeText={setLocationName} style={{marginLeft: 7}}/>
        </View>
        <View style={style.smallInputs}>
          <MaterialCommunityIcons name='timer' size={16} color='darkgray'/>
          <TextInputNative placeholder='est. time' value={estimatedTime} onChangeText={setEstimatedTime} style={{marginLeft: 7}}/>
        </View>
      </View>
      <MultiLineInput questDescription={questDescription} setQuestDescription={setQuestDescription}/>
      <Button 
        disabled={(questTitle && locationName && estimatedTime && questDescription && route.params.latitude && route.params.longitude) ? false : true} 
        theme={{colors: {primary: Colors.primary}}} 
        icon='content-save' 
        mode='contained' 
        onPress={() => {createQuestRequest(questTitle, questDescription, image, route.params.latitude, route.params.longitude, locationName, [])}}
      >
        Save
      </Button>
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
    backgroundColor: Colors.background,
    fontSize: 23
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
