import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, IconButton, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule } from '../CreateModuleScreen';
import I18n from 'i18n-js';
import { lightGray, primary } from '../../../styles/colors';
import _ from 'lodash';
import { Colors } from '../../../styles';
import { PrototypeChoiceModule } from '../../../types/prototypes';

interface IChoiceModuleData {
    choiceTexts: string[],
    objective: string,
}

const maxChoices = 5;

export const ChoiceModule: React.FC<ICreateModule<PrototypeChoiceModule>> = ({ setFinalModule, edit, defaultValues, setComponents, scrollToPreview }) => {

    const [moduleData, setModuleData] = useState<IChoiceModuleData>(
        edit 
        ? { // edit module
            choiceTexts: defaultValues!.choices!.map(c => c.text),
            objective: defaultValues!.objective
        }
        : { // new module
            choiceTexts: ['', ''], 
            objective: ''}
        );

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

    const parseToModule = (moduleData: IChoiceModuleData): PrototypeChoiceModule => {
        return ({
            id: -1,
            type: 'Choice',
            components: [],
            choices: moduleData.choiceTexts.map((text, idx) => ({
                text: text,
                nextModuleReference: (edit && defaultValues && idx in defaultValues.choices) ? defaultValues.choices[idx].nextModuleReference : null,
            })),
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
                Add choices
            </Subheading>
            <View 
                style={{
                    marginBottom: 20
                }}>
                {moduleData.choiceTexts.map((text, idx) => 
                    <View 
                        key={idx}
                        style={{
                            backgroundColor: lightGray,
                            elevation: 2,
                            padding: 5,
                            borderRadius: 10,
                            marginBottom: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignContent: 'center',
                            alignSelf: 'center'
                        }}>
                        <View style={{
                            flexGrow: 1,
                            alignSelf: 'center'
                                }}>
                            <TextInput 
                                theme={{colors: {primary: primary}}}
                                value={text}
                                underlineColor="transparent"
                                style={{
                                    borderRadius: 5 // What in gods fucking name is this sorcery. I've no idea how to solve this
                                }}
                                placeholder='Enter choice text...'
                                onChangeText={(text) => {
                                    let c = _.cloneDeep(moduleData.choiceTexts)
                                    c[idx] = text
                                    setModuleData({
                                        ...moduleData,
                                        choiceTexts: c
                                    })
                                }}/>
                        </View>

                        <IconButton
                            theme={{colors: {primary: primary}}}     
                            style={{marginHorizontal: 15}}
                            disabled={moduleData.choiceTexts.length <= 2}
                            onPress={() => setModuleData({...moduleData, choiceTexts: moduleData.choiceTexts.filter((_, idx_i) => idx_i !== idx)})}
                            icon='delete'/>
                    </View>)}
                    <View 
                        style={{
                            backgroundColor: lightGray,
                            // TODO: Maybe set animation here somewhere :thinking:
                            elevation: 2,
                            borderRadius: 10,
                            marginBottom: 20,
                            alignItems: 'center'
                        }}>
                        <IconButton 
                            theme={{colors: {primary: primary}}}
                            size={30}
                            disabled={moduleData.choiceTexts.length >= maxChoices }
                            onPress={() => setModuleData({...moduleData, choiceTexts: moduleData.choiceTexts.concat('')})}
                            icon='plus'/>
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