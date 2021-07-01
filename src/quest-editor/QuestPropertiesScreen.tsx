import React from 'react';
import { View, StyleSheet, TextInput as TextInputNative} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors, Containers } from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from '../common/ImagePicker';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { pushNewImages, setEstimatedTime, setImagePath, setImageReference, setImages, setLocationName, setNewImages, setNewImagesAt, setQuestDescription, setQuestTitle, spliceQuestImages } from '../redux/editor/editorSlice';
import I18n from 'i18n-js';
import { createPutRequest } from '../utils/requestHandler';
import { Image, NewImage } from '../types/quest';
import { getImageAddress } from '../utils/imageHandler';

export const QuestPropertiesScreen = () => {
  const questPrototype = useAppSelector(state => state.editor.questPrototype)
  const questId = useAppSelector(state => state.editor.questId)
  const imagePath = useAppSelector(state => state.editor.imagePath)
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
      <ImagePicker
        setBase64={
          (base64) => {
            if(questPrototype == null)
              return;
            
            if(questPrototype.imageReference == null) {
              const freeReference = findFreeReference([...questPrototype.images, ...newImages]);
              dispatch(pushNewImages({reference: freeReference, image: base64}));
              dispatch(setImageReference(freeReference));
              return;
            }

            // if reference exists in questPrototype.images, delete from images and push new image to newImages
            let index
            if((index = questPrototype.images.findIndex(image => image.reference === questPrototype.imageReference)) !== -1) {
              dispatch(spliceQuestImages(index));
              dispatch(pushNewImages({reference: questPrototype.imageReference, image: base64}));

            // if reference exists in newImages but not in images
            } else if ((index = newImages.findIndex(image => image.reference === questPrototype.imageReference)) !== -1) {
                dispatch(setNewImagesAt({index: index, value: {reference: questPrototype.imageReference, image: base64}}));
            } else {
                // if reference doesn't exist anywhere, find free reference and use it
                const freeReference = findFreeReference([...questPrototype.images, ...newImages]);
                dispatch(pushNewImages({reference: findFreeReference([...questPrototype.images, ...newImages]), image: base64}));
                dispatch(setImageReference(freeReference));
            }
          }
        } 
        image={
          questPrototype && questPrototype.imageReference != null && questPrototype.images.find(image => image.reference === questPrototype.imageReference) ? 
            getImageAddress(questPrototype.images.find(image => image.reference === questPrototype.imageReference)!.imageId, '') :
            imagePath
        } 
        setImage={
          (path: string) => {
            dispatch(setImagePath(path))
          }
        } 
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
          )
        } 
        theme={{colors: {primary: Colors.primary}}} 
        icon='content-save' 
        mode='contained' 
        onPress={() => {
          createPutRequest(questId!, questPrototype!, newImages)
            .then(r => r.json())
            .then(data => {dispatch(setImages(data.images));dispatch(setNewImages([]))})
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
