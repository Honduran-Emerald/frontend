import React, { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Button, IconButton, List, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule, IModuleBase } from './CreateModuleScreen';
import i18n from 'i18n-js';
import { lightGray, primary } from '../../styles/colors';
import _ from 'lodash';
import { Colors } from '../../styles';
import I18n from 'i18n-js';
import { useEffect } from 'react';
import { PrototypeChoiceModule } from '../../types/quest';

interface IChoiceModuleData {
    text: string,
    choiceTexts: string[],
    objective: string,
}

const maxChoices = 5;

export const CreateChoiceModule: React.FC<ICreateModule<PrototypeChoiceModule>> = ({ setFinalModule, edit, defaultValues }) => {

    const [moduleData, setModuleData] = useState<IChoiceModuleData>(
        edit 
        ? { // edit module
            text: defaultValues!.components[0].text!, // TODO: Change this once multiple modules can be used
            choiceTexts: defaultValues!.choices!.map(c => c.text),
            objective: defaultValues!.objective
        }
        : { // new module
            text: '', 
            choiceTexts: ['', ''], 
            objective: ''}
        );

    const parseToModule = (moduleData: IChoiceModuleData): PrototypeChoiceModule => {
        return ({
            id: -1,
            type: 'Choice',
            components: [{
                type: 'text',
                text: moduleData.text
            }],
            choices: moduleData.choiceTexts.map((text, idx) => ({
                text: text,
                nextModuleId: (edit && defaultValues && idx in defaultValues.choices) ? defaultValues.choices[idx].nextModuleId : null,
            })),
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
                {i18n.t('addEndText')}
            </Subheading>
            <TextInput 
                theme={{colors: {primary: primary}}}
                style={{marginVertical: 10}}
                value={moduleData.text}
                onChange={(data) => setModuleData({...moduleData, text: data.nativeEvent.text})}
                multiline/>

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
                onPress={() => {setFinalModule(parseToModule(moduleData)) /* TODO: Add Module Preprocessing here as soon as module structure is fully defined. Don't forget it */}}>
                
                {i18n.t('createModuleButton')}
            </Button>
        </View>
    )
}