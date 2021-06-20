import React, { useState } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as PickImage from 'expo-image-picker';
import { Colors, Containers } from '../styles';

interface ImagePickerProps {
  aspect? : [number, number], 
  setBase64: (base64: string) => void, 
  image : string, 
  setImage : (path: string) => void, 
  style? : ViewStyle | ViewStyle[]
}
export const ImagePicker : React.FC<ImagePickerProps> = ({aspect, image, setImage, setBase64, style}) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

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

  const pickImage = async () => {
    let result = await PickImage.launchImageLibraryAsync({
      mediaTypes: PickImage.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: aspect ? aspect : [9, 5],
      quality: 1,
      base64: true
    });
    
    if(!result.cancelled) {
      setImage(result.uri)
      result.base64 && setBase64(result.base64)
    }
  }

  return(
    <View style={[style, {overflow: 'hidden'}]}>
      <TouchableOpacity onPress={permissionGranted ? pickImage : () => requestPermission().then(x => {x && pickImage()})} style={[styleSheet.imagePicker]}>
        {image ? <Image source={{uri: image}} style={styleSheet.image}/> : <MaterialCommunityIcons name='image-plus' size={32}/>}
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