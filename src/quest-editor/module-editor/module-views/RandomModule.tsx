import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule } from '../CreateModuleScreen';
import I18n from 'i18n-js';
import _ from 'lodash';
import { Colors, Containers } from '../../../styles';
import { PrototypeRandomModule } from '../../../types/prototypes';
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
    }, []);

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
        setFinalModule(parseToModule(moduleData));
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
                style={{margin: 10, marginTop: 20, fontSize: 20}}>
                Choose Path Probabilites
            </Subheading>
            <View 
                style={{
                    marginBottom: 20
                }}>
            <View style={{
                flex: 1,
                alignItems: 'center',
                width: '100%',
                marginTop: 40,
                marginBottom: 20
            }}>
                <View style={{backgroundColor: '#FFF', borderColor: '#000', borderWidth: 1, ...Containers.rounded, padding: 20}}>

                    <Text style={{fontSize: 18}}>{'Probability of\n' } Path 1: <Text style={{color: Colors.primary}}>{(slider * 100).toFixed()}%</Text></Text>
                </View>
                <View style={{ height: 200, alignSelf: 'center'}}>
                    <Slider
                        style={{width: 200, height: 200, transform: [{rotate: '-90deg'}]}}
                        minimumValue={0}
                        maximumValue={1}
                        step={0.05}
                        minimumTrackTintColor={Colors.primary}
                        maximumTrackTintColor={'gray'}
                        thumbTintColor={Colors.primary}
                        value={moduleData.weight}
                        onValueChange={setSlider}
                        inverted
                        
                        onSlidingComplete={(value) => {
                            setModuleData({...moduleData, weight: value})
                        }}
                    />
                </View>
                <View style={{backgroundColor: '#FFF', borderColor: '#000', borderWidth: 1, ...Containers.rounded, padding: 20}}>
                    <Text style={{fontSize: 18}}>{'Probability of\n' } Path 2: <Text style={{color: Colors.primary}}>{((1 - slider) * 100).toFixed()}%</Text></Text>
                </View>
                
            </View>
            
            </View>
                
            <Button 
                theme={{colors: {primary: Colors.primary}}}
                mode='contained'
                style={{marginBottom: 20}}
                onPress={scrollToPreview}>
                
                {I18n.t('createModuleButton')}
            </Button>
        </View>
    )
}