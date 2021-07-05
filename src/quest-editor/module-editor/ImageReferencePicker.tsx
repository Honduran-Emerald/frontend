import React, { useState } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as PickImage from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Colors, Containers } from '../../styles';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setNewImageReference } from '../../redux/editor/editorSlice';
import { useEffect } from 'react';
import { getImageAddress } from '../../utils/imageHandler';

interface ImagePickerProps {
  aspect? : [number, number], 
  style? : ViewStyle | ViewStyle[],
  reference: number | undefined | null,
  setReference : (reference: number) => void
}
export const ImageReferencePicker : React.FC<ImagePickerProps> = ({aspect, style, reference, setReference}) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [loadedImage, setLoadedImage] = useState<string | null>(null)

  const questPrototype = useAppSelector(state => state.editor.questPrototype);
  const newImages = useAppSelector(state => state.editor.newImages);
  const dispatch = useAppDispatch();

  const requestPermission = async () => {
    const { status } = await PickImage.requestMediaLibraryPermissionsAsync();

    if(status !== 'granted') {
      setPermissionGranted(false);
      alert('Sorry, we need camera roll permissions to make this work!');
      return false
    } else {
      setPermissionGranted(true);
      return true
    }
  }

  useEffect(() => {
    if (reference != undefined) {
      const base64p = newImages?.find(im => im.reference === reference)?.image
      const linkp = questPrototype?.images.find(im => im.reference === reference)?.imageId
      const uri = base64p ? `data:image/gif;base64,${base64p}` 
                  : linkp ? getImageAddress(linkp, '')
                  : null 
      setLoadedImage(uri)
    }
    
  }, [newImages, questPrototype, reference])

  const pickImage = async () => {
    let result = await PickImage.launchImageLibraryAsync({
      mediaTypes: PickImage.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: aspect ? aspect : [9, 5],
    });


    
    if(!result.cancelled) {
      const manipulation = await ImageManipulator.manipulateAsync(
        result.uri,
        [
          { resize: {
              width: 1800,
              height: 1000
              }}
        ],
        {
          base64: true,
          compress: 0.6 // This probably can be tuned down a bit to save bandwidth
        }
      )
      //setLoadedImage(result.uri) //uncomment later
      if (manipulation.base64) {
        console.log('Image Size', manipulation.base64.length)
        let localRef = reference
        if (!localRef) {
          localRef = Math.max(...newImages.map(im => im.reference).concat(questPrototype?.images.map(im => im.reference) || []), -1) + 1
          setReference(localRef)
        }
        dispatch(setNewImageReference({
          reference: localRef,
          base64: manipulation.base64
        }))
      }
    }
  }

  return(
    <View style={[style, {overflow: 'hidden'}]}>
      <TouchableOpacity onPress={permissionGranted ? pickImage : () => requestPermission().then(x => {x && pickImage()})} style={[styleSheet.imagePicker]}>
        {loadedImage ? <Image source={{uri: loadedImage}} style={styleSheet.image}/> : <MaterialCommunityIcons name='image-plus' size={32}/>}
      </TouchableOpacity>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  imagePicker: {
    ...Containers.center,
    ...Containers.rounded,
    ...Containers.fullHeightAndWidth,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray
  },
  image: {
    ...Containers.fullHeightAndWidth
  }
});