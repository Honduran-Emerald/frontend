import React from 'react';
import { View, StyleSheet, TextInput as TextInputNative} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors, Containers } from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from '../common/ImagePicker';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setEstimatedTime, setImage, setLocationName, setQuestDescription, setQuestTitle } from '../redux/editor/editorSlice';
import I18n from 'i18n-js';

export const QuestPropertiesScreen = () => {

  const questPrototype = useAppSelector(state => state.editor.questPrototype)
  const imagePath = useAppSelector(state => state.editor.imagePath)
  const dispatch = useAppDispatch();

  return(
    <KeyboardAwareScrollView
      contentContainerStyle={style.scrollViewContentContainer}
      scrollEnabled
      viewIsInsideTabBar
      enableOnAndroid
      extraHeight={100}
      style={{backgroundColor: Colors.background}}
    >
      <TextInput 
        placeholder={I18n.t('propertiesQuestTitle')}
        value={questPrototype!.title} 
        onChange={(text) => dispatch(setQuestTitle(text.nativeEvent.text))}
        theme={{colors: {primary: Colors.primary}}} 
        style={[style.container, style.questTitleInput]}
      />
      <ImagePicker image={imagePath} setImage={(path: any) => dispatch(setImage(path))} style={[style.container, style.imagePicker]}/>
      <View style={[style.container, style.smallInputsGroup]}>
        <View style={style.smallInputs}>
          <MaterialCommunityIcons name='map-marker' size={16} color='darkgray'/>
          <TextInputNative placeholder={I18n.t('propertiesLocName')} value={questPrototype!.locationName} onChangeText={val => dispatch(setLocationName(val))} style={{marginHorizontal: 7, flex: 1}}/>
        </View>
        <View style={style.smallInputs}>
          <MaterialCommunityIcons name='timer' size={16} color='darkgray'/>
          <TextInputNative placeholder={I18n.t('propertiesEstTime')} value={questPrototype!.approximateTime} onChangeText={val => dispatch(setEstimatedTime(val))} style={{marginHorizontal: 7, flex: 1}}/>
        </View>
      </View>
      <MultiLineInput questDescription={questPrototype!.description} setQuestDescription={val => dispatch(setQuestDescription(val))}/>
      <Button 
        disabled={
          !(questPrototype!.title 
            && questPrototype!.locationName 
            && questPrototype!.approximateTime  
            && questPrototype!.description
          )
        } 
        theme={{colors: {primary: Colors.primary}}} 
        icon='content-save' 
        mode='contained' 
        onPress={() => {
          alert(JSON.stringify(questPrototype))
          //createPutRequest(questPrototype!.id, questPrototype!)
          }}
      >
        {I18n.t('saveButton')}
      </Button>
    </KeyboardAwareScrollView>
  );
}

const MultiLineInput : React.FC<{questDescription: string, setQuestDescription: (val: string) => void}> = ({questDescription, setQuestDescription}) => (
  <View style={[style.container, style.description]}>
    <TextInputNative
      multiline
      numberOfLines={15}
      style={style.descriptionInput}
      value={questDescription} 
      onChangeText={(text) => setQuestDescription(text)} 
      placeholder={I18n.t('propertiesDescription')}
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
