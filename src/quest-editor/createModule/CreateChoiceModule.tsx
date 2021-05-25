import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Subheading, TextInput, Title } from 'react-native-paper';
import { ICreateModule } from './CreateModuleScreen';
import i18n from 'i18n-js';

export const CreateChoiceModule: React.FC<ICreateModule> = ({ setFinalModule }) => {

    const [moduleData, setModuleData] = useState<any>({});

    return (
        <View style={{marginHorizontal: 10}}>
            <Subheading 
                style={{margin: 10, marginTop: 20}}>
                {i18n.t('addEndText')}
            </Subheading>
            <TextInput 
                style={{marginVertical: 10}}
                value={moduleData.text || ''}
                onChange={(data) => setModuleData({...moduleData, text: data.nativeEvent.text})}
                multiline/>

            <Subheading 
                style={{margin: 10, marginTop: 20}}>
                {i18n.t('addEndSlider')}
            </Subheading>

            <Text>
                TODO: Add Slider here because react-native-paper does not have sliders
            </Text>


            <Button 
                mode='contained'
                style={{marginBottom: 20}}
                onPress={() => {setFinalModule(moduleData) /* TODO: Add Module Preprocessing here as soon as module structure is fully defined. Don't forget it */}}>
                Create Module
            </Button>
        </View>
    )
}