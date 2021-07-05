import React from 'react';
import { View, StyleSheet, TextInput as TextInputNative} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors, Containers } from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setEstimatedTime, setImageReference, setImages, setLocationName, setNewImages, setQuestDescription, setQuestTitle } from '../redux/editor/editorSlice';
import I18n from 'i18n-js';
import { createAndPutRequest } from '../utils/requestHandler';
import { Image, NewImage } from '../types/quest';
import { ImageReferencePicker } from './module-editor/ImageReferencePicker';
import { useState } from 'react';

export const QuestPropertiesScreen = () => {
  const questPrototype = useAppSelector(state => state.editor.questPrototype)
  const questId = useAppSelector(state => state.editor.questId)
  const imagePath = useAppSelector(state => state.editor.imagePath)
  const [displayImageReference, setDisplayImageReference] = useState<undefined | number>();
  const [isSaving, setIsSaving] = useState(false);
  const newImages = useAppSelector(state => state.editor.newImages)
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
        defaultValue={questPrototype!.title} 
        onEndEditing={(event) => {
          dispatch(setQuestTitle(event.nativeEvent.text))
        }}
        theme={{colors: {primary: Colors.primary}}} 
        style={[style.container, style.questTitleInput]}
      />
      <ImageReferencePicker 
        reference={questPrototype?.imageReference}
        setReference={(ref) => dispatch(setImageReference(ref))}
        style={[style.container, style.imagePicker]}
      />
      <View style={[style.container, style.smallInputsGroup]}>
        <View style={style.smallInputs}>
          <MaterialCommunityIcons name='map-marker' size={16} color='darkgray'/>
          <TextInputNative placeholder={I18n.t('propertiesLocName')} defaultValue={questPrototype!.locationName} onEndEditing={event => dispatch(setLocationName(event.nativeEvent.text))} style={{marginHorizontal: 7, flex: 1}}/>
        </View>
        <View style={style.smallInputs}>
          <MaterialCommunityIcons name='timer' size={16} color='darkgray'/>
          <TextInputNative placeholder={I18n.t('propertiesEstTime')} defaultValue={questPrototype!.approximateTime} onEndEditing={event => dispatch(setEstimatedTime(event.nativeEvent.text))} style={{marginHorizontal: 7, flex: 1}}/>
        </View>
      </View>
      <MultiLineInput questDescription={questPrototype!.description} setQuestDescription={val => dispatch(setQuestDescription(val))}/>
      <Button 
        disabled={
          !(questPrototype!.title 
            && questPrototype!.locationName 
            && questPrototype!.approximateTime  
            && questPrototype!.description
          ) && isSaving
        } 
        theme={{colors: {primary: Colors.primary}}} 
        icon='content-save' 
        mode='contained' 
        loading={isSaving}
        onPress={() => {
          setIsSaving(true);
          createAndPutRequest(questId!, questPrototype!, newImages)
            .then(r => r.json())
            .then(data => {dispatch(setImages(questPrototype!.images.concat(data.images)));dispatch(setNewImages([]))})
            //.catch(() => console.log('Image too large.')) // TODO Compress
            .then(() => setIsSaving(false))
          }}
      >
        {I18n.t('saveButton')}
      </Button>
    </KeyboardAwareScrollView>
  );
}

/**
 * 
 * @param images Array of images to search for a free reference
 * @returns The value of a reference that is not occupied yet
 */
function findFreeReference(images : Array<Image | NewImage>) {
  for(let i = 0; ; i++) {
    if(images.findIndex(image => image.reference === i) === -1)
      return i
  }
}

const MultiLineInput : React.FC<{questDescription: string, setQuestDescription: (val: string) => void}> = ({questDescription, setQuestDescription}) => (
  <View style={[style.container, style.description]}>
    <TextInputNative
      multiline
      numberOfLines={15}
      style={style.descriptionInput}
      defaultValue={questDescription}
      onEndEditing={event => setQuestDescription(event.nativeEvent.text)} 
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
