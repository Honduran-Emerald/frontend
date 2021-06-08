import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Subheading, TextInput, Title } from 'react-native-paper';
import { ICreateModule } from './CreateModuleScreen';
import i18n from 'i18n-js';
import { PrototypeComponent } from '../../types/quest';

export const CreateStoryModule: React.FC<ICreateModule> = ({ setFinalModule }) => {

    const [moduleData, setModuleData] = useState<any>({});
    const [components, setComponents] = useState<PrototypeComponent[]>([])

    return (
        <View style={{marginHorizontal: 10}}>
            <Subheading 
                style={{margin: 10, marginTop: 20}}>
                {i18n.t('addStoryText')}
            </Subheading>
            <TextInput 
                style={{marginVertical: 10}}
                value={moduleData.text || ''}
                onChange={(data) => setModuleData({...moduleData, text: data.nativeEvent.text})}
                multiline/>
            <Button 
                mode='contained'
                style={{marginBottom: 20}}
                onPress={() => {setFinalModule(moduleData) /* TODO: Add Module Preprocessing here as soon as module structure is fully defined. Don't forget it */}}>
                {i18n.t('createModuleButton')}
            </Button>
        </View>
    )
}