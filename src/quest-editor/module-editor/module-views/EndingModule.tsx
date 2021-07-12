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
  endingFactor: endingFactorType
}

type endingFactorType = 0 | 0.5 | 1

export const EndingModule: React.FC<ICreateModule<PrototypeEndingModule>> = ({ setFinalModule, edit, defaultValues, setComponents, scrollToPreview }) => {

  const [moduleData, setModuleData] = useState<IEndingModuleData>(edit ? {
    objective: defaultValues?.objective || '',
    endingFactor: defaultValues?.endingFactor !== undefined ? defaultValues.endingFactor : 0.5 
  } : {
    objective: '',
    endingFactor: 0.5
  });

  const setEndingFactor = (value : endingFactorType) => {
    setModuleData({...moduleData, endingFactor: value});
  }

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
    console.log('endingFactor: ', moduleData.endingFactor)
    return ({
      id: -1,
      type: 'Ending',
      endingFactor: moduleData.endingFactor, //TODO Make this dynamic
      components: [],
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
        {i18n.t('addEndSlider')}
      </Subheading>
      
      <EndingTypePicker initialValue={moduleData.endingFactor} setEndingFactor={setEndingFactor}/>
      
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

const EndingTypePicker = ({setEndingFactor, initialValue} : {setEndingFactor: (value: endingFactorType) => void, initialValue: endingFactorType}) => {
  const [selected, setSelected] = useState<'bad'|'neutral'|'good'>(initialValue === 0 ? 'bad' : initialValue === 0.5 ? 'neutral' : 'good');
  
  return(
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20}}>
      <Button 
        theme={selected !== 'bad' ? {colors: {primary: Colors.gray}} : {colors: {primary: 'darkred'}}}
        mode='contained'
        labelStyle={selected !== 'bad' && {color: 'darkgray'}}
        style={{width: '30%'}}
        onPress={() => {
          setSelected('bad');
          setEndingFactor(0);
        }}
      >
        Bad
      </Button>
      <Button 
        theme={selected !== 'neutral' ? {colors: {primary: Colors.gray}} : {colors: {primary: primary}}}
        mode='contained'
        labelStyle={selected !== 'neutral' && {color: 'darkgray'}}
        style={{width: '30%'}}
        onPress={() => {
          setSelected('neutral');
          setEndingFactor(0.5);
        }}
      >
        Neutral
      </Button>
      <Button 
        theme={selected !== 'good' ? {colors: {primary: Colors.gray}} : {colors: {primary: 'green'}}}
        mode='contained'
        labelStyle={selected !== 'good' && {color: 'darkgray'}}
        style={{width: '30%'}}
        onPress={() => {
          setSelected('good');
          setEndingFactor(1);
        }}
      >
        Good
      </Button>
    </View>
  );
}