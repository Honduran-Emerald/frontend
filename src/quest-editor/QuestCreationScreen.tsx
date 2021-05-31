import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors, Containers } from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { background } from '../styles/colors';

export const QuestCreationScreen = () => {
  const [questTitle, setQuestTitle] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    })();
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1
    });

    console.log(result);
    
    if(!result.cancelled) {
      setImage(result.uri)
    }
  }

  return(
    <ScrollView contentContainerStyle={style.scrollViewContentContainer}>
      <TextInput theme={{colors: {primary: Colors.primary}}} style={style.questTitleInput} value={questTitle} onChange={(text) => {setQuestTitle(text.nativeEvent.text)}} placeholder='Quest Title'/>
      <TouchableOpacity onPress={pickImage} style={style.imagePicker}>
        {image ? <Image source={{uri: image}} style={style.image}/> : <MaterialCommunityIcons name='image-plus' size={32}/>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  scrollViewContentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  questTitleInput: {
    width: '80%',
    backgroundColor: Colors.background
  },
  imagePicker: {
    ...Containers.center,
    ...Containers.rounded,
    width: '80%',
    height: 200,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
    marginTop: 20
  },
  image: {
    width: '100%',
    height: '100%'
  }
})
