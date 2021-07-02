import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, IconButton, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule } from '../CreateModuleScreen';
import I18n from 'i18n-js';
import { lightGray, primary } from '../../../styles/colors';
import _ from 'lodash';
import { Colors } from '../../../styles';
import { PrototypeChoiceModule, PrototypeTextComponent } from '../../../types/prototypes';

interface IChoiceModuleData {
    text: string,
    choiceTexts: string[],
    objective: string,
}

const maxChoices = 5;

export const ChoiceModule: React.FC<ICreateModule<PrototypeChoiceModule>> = ({ setFinalModule, edit, defaultValues }) => {

    const [moduleData, setModuleData] = useState<IChoiceModuleData>(
        edit 
        ? { // edit module
            text: (defaultValues!.components[0] as PrototypeTextComponent).text!, // TODO: Change this once multiple modules can be used
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
                type: 'Text',
                text: moduleData.text
            }],
            choices: moduleData.choiceTexts.map((text, idx) => ({
                text: text,
                nextModuleReference: (edit && defaultValues && idx in defaultValues.choices) ? defaultValues.choices[idx].nextModuleReference : null,
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
                {I18n.t('addEndText')}
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
                
                {I18n.t('createModuleButton')}
            </Button>
        </View>
    )
}