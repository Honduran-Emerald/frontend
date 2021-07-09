import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule, IModuleBase } from '../CreateModuleScreen';
import i18n from 'i18n-js';
import { primary } from '../../../styles/colors';
import { Colors } from '../../../styles';
import I18n from 'i18n-js';
import { PrototypeComponent, PrototypePassphraseModule, PrototypeStoryModule, PrototypeTextComponent } from '../../../types/prototypes';
import { ComponentCreator } from '../ComponentCreator';
import { useEffect } from 'react';


interface IPassphraseModuleData {
    text: string,
    objective: string,
}

export const PassphraseModule: React.FC<ICreateModule<PrototypePassphraseModule>> = ({ setFinalModule, edit, defaultValues, setComponents, scrollToPreview }) => {

    const [moduleData, setModuleData] = useState<IPassphraseModuleData>(edit 
        ? {
            text: defaultValues?.text || '',
            objective: defaultValues?.objective || '',
        } : {
            text: '', 
            objective: ''
        });

    useEffect(() => {
        if (!edit) {
            setComponents([
                {
                    type: 'Text',
                    text: ''
                }
            ])
        }
    }, [])

    const parseToModule = (moduleData: IPassphraseModuleData): PrototypePassphraseModule => {
        return ({
            id: -1,
            objective: moduleData.objective,
            type: 'Passphrase',
            components: [],
            text: moduleData.text,
            nextModuleReference: (edit && defaultValues) ? defaultValues.nextModuleReference : null
        })
    }

    useEffect(() => {
        setFinalModule(parseToModule(moduleData))
    }, [moduleData])

    return (
        <View style={{marginHorizontal: 10}}>
            <TextInput
                dense
                style={{marginVertical: 20}}
                label={I18n.t('moduleObjectiveLabel')}
                value={moduleData.objective}
                onChangeText={(data) => setModuleData({...moduleData, objective: data})}
                theme={{colors: {primary: Colors.primary}}} />
            <Divider/>
            <Subheading 
                style={{margin: 10, marginTop: 20}}>
                {/* i18n.t('addStoryText') */ 'Choose a passphrase. The user needs to enter this exact passphrase to continue. Make sure they can figure it out.'}
            </Subheading>

            <TextInput
                dense
                style={{marginVertical: 20, marginHorizontal: 10}}
                label={'Set Passphrase'}
                value={moduleData.text}
                onChangeText={(data) => setModuleData({...moduleData, text: data})}
                theme={{colors: {primary: Colors.primary}}} />
            <Divider/>

            <Button 
                theme={{colors: {primary: primary}}}
                mode='contained'
                style={{marginBottom: 20}}

                onPress={scrollToPreview}>
                {i18n.t('createModuleButton')}
            </Button>
        </View>
    )
}