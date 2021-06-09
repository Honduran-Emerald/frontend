import React, { useState } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as PickImage from 'expo-image-picker';
import { Colors, Containers } from '../styles';

export const ImagePicker : React.FC<{image : string, setImage : (path: string) => void, style? : ViewStyle | ViewStyle[]}> = ({image, setImage, style}) => {
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
      aspect: [9, 5],
      quality: 1
    });

    console.log(result);
    
    if(!result.cancelled) {
      setImage(result.uri)
    }
  }

  return(
    <View style={style}>
      <TouchableOpacity onPress={permissionGranted ? pickImage : () => requestPermission().then(x => {x && pickImage()})} style={styleSheet.imagePicker}>
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