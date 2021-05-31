import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Colors } from '../styles';

export const QuestCreationScreen = () => {
  const [questTitle, setQuestTitle] = useState<string>("");

  return(
    <ScrollView>
      <TextInput theme={{colors: {primary: Colors.primary}}} value={questTitle} onChange={(text) => {setQuestTitle(text.nativeEvent.text)}} placeholder='Quest Title'/>
    </ScrollView>
  );
}
