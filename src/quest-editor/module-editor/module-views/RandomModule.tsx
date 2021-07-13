import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, IconButton, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule } from '../CreateModuleScreen';
import I18n from 'i18n-js';
import { lightGray, primary } from '../../../styles/colors';
import _ from 'lodash';
import { Colors, Containers } from '../../../styles';
import { PrototypeChoiceModule, PrototypeRandomModule } from '../../../types/prototypes';
import { Text } from 'react-native';
import Slider from '@react-native-community/slider'

interface IRandomModuleData {
    objective: string,
    weight: number
}

export const RandomModule: React.FC<ICreateModule<PrototypeRandomModule>> = ({ setFinalModule, edit, defaultValues, setComponents, scrollToPreview }) => {

    const [slider, setSlider] = useState(edit ? defaultValues!.leftRatio : 0.5);

    const [moduleData, setModuleData] = useState<IRandomModuleData>(
        edit 
        ? { // edit module
            objective: defaultValues!.objective,
            weight: defaultValues!.leftRatio
        }
        : { // new module
            objective: '',
            weight: 0.5
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

    const parseToModule = (moduleData: IRandomModuleData): PrototypeRandomModule => {
        return ({
            id: -1,
            type: 'Random',
            components: [],
            leftRatio: moduleData.weight,
            nextLeftModuleReference: defaultValues?.nextLeftModuleReference || null,
            nextRightModuleReference: defaultValues?.nextRightModuleReference || null,
            objective: moduleData.objective
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
                Choose Path Weights
            </Subheading>
            <View 
                style={{
                    marginBottom: 20
                }}>
            <View style={{
                flex: 1,
                alignItems: 'baseline',
                marginTop: 20
            }}>
                <Text>Probability of Path 1: {(slider * 100).toFixed()}%</Text>
                <View style={{transform: [{rotate: '-90deg'}], height: 200}}>
                    <Slider
                        style={{width: 200}}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        value={moduleData.weight}
                        inverted
                        onValueChange={setSlider}
                        
                        onSlidingComplete={(value) => {
                            setModuleData({...moduleData, weight: value})
                        }}
                    />
                </View>
                <Text>Probability of Path 2: {((1 - slider) * 100).toFixed()}%</Text>
            </View>
            
            </View>
                
            <Button 
                theme={{colors: {primary: primary}}}
                mode='contained'
                style={{marginBottom: 20}}
                onPress={scrollToPreview}>
                
                {I18n.t('createModuleButton')}
            </Button>
        </View>
    )
}