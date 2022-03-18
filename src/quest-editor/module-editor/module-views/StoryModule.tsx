import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule, IModuleBase } from '../CreateModuleScreen';
import i18n from 'i18n-js';
import { primary } from '../../../styles/colors';
import { Colors } from '../../../styles';
import I18n from 'i18n-js';
import { PrototypeComponent, PrototypeStoryModule, PrototypeTextComponent } from '../../../types/prototypes';
import { ComponentCreator } from '../ComponentCreator';
import { useEffect } from 'react';


interface IStoryModuleData {
    objective: string,
}

export const StoryModule: React.FC<ICreateModule<PrototypeStoryModule>> = ({ setFinalModule, edit, defaultValues, setComponents, scrollToPreview }) => {

    const [moduleData, setModuleData] = useState<IStoryModuleData>(edit 
        ? {
            objective: defaultValues?.objective || '',
        } : {
            objective: ''
        });

    useEffect(() => {
        if (!edit) {
            setComponents([
                {
                    type: 'Text',
                    text: ''
                },
                {
                    type: 'Image',
                    imageReference: null
                }
            ])
        }
    }, [])

    const parseToModule = (moduleData: IStoryModuleData): PrototypeStoryModule => {
        return ({
            id: -1,
            objective: moduleData.objective,
            type: 'Story',
            components: [],
            nextModuleReference: (edit && defaultValues) ? defaultValues.nextModuleReference : null
        })
    }

    useEffect(() => {
        setFinalModule(parseToModule(moduleData))
    }, [moduleData])

    return (
        <View style={{marginHorizontal: 10}}>
            <Subheading 
                style={{margin: 10, marginTop: 20}}>
                {/* i18n.t('addStoryText') */ 'Set module Objective'}
            </Subheading>
            <TextInput
                dense
                style={{marginVertical: 20}}
                label={I18n.t('moduleObjectiveLabel')}
                value={moduleData.objective}
                onChangeText={(data) => setModuleData({...moduleData, objective: data})}
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