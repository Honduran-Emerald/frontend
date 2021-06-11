import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Subheading, TextInput, Title } from 'react-native-paper';
import { ICreateModule, IModuleBase } from './CreateModuleScreen';
import i18n from 'i18n-js';
import { primary } from '../../styles/colors';

interface IEndingModuleData {
    text?: string
}

export const CreateEndModule: React.FC<ICreateModule> = ({ setFinalModule }) => {

    const [moduleData, setModuleData] = useState<any>({});

    const parseToModule = (moduleData: IEndingModuleData): IModuleBase => {
        return ({
            type: 'Ending',
            endingFactor: 1, //TODO Make this dynamic
            components: [{
                type: 'text',
                text: moduleData.text
            }]
        })
    }


    return (
        <View style={{marginHorizontal: 10}}>
            <Subheading 
                style={{margin: 10, marginTop: 20}}>
                {i18n.t('addEndText')}
            </Subheading>
            <TextInput 
                theme={{colors: {primary: primary}}}
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
                theme={{colors: {primary: primary}}}
                mode='contained'
                style={{marginBottom: 20}}
                onPress={() => {setFinalModule(parseToModule(moduleData)) /* TODO: Add Module Preprocessing here as soon as module structure is fully defined. Don't forget it */}}>
                
                {i18n.t('createModuleButton')}
            </Button>
        </View>
    )
}