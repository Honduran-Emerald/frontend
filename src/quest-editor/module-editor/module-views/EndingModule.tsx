import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule } from '../CreateModuleScreen';
import i18n from 'i18n-js';
import { primary } from '../../../styles/colors';
import I18n from 'i18n-js';
import { Colors } from '../../../styles';
import { PrototypeEndingModule, PrototypeTextComponent } from '../../../types/prototypes';

interface IEndingModuleData {
    objective: string,
}

export const EndingModule: React.FC<ICreateModule<PrototypeEndingModule>> = ({ setFinalModule, edit, defaultValues, setComponents }) => {

    const [moduleData, setModuleData] = useState<IEndingModuleData>(edit ? {
        objective: defaultValues?.objective || ''
    } : {
        objective: '',
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


    const parseToModule = (moduleData: IEndingModuleData): PrototypeEndingModule => {
        return ({
            id: -1,
            type: 'Ending',
            endingFactor: (edit && defaultValues) ? defaultValues.endingFactor : 1, //TODO Make this dynamic
            components: [],
            objective: moduleData.objective
        })
    }


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