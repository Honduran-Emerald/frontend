import I18n from 'i18n-js';
import React from 'react';
import { Dimensions, TouchableHighlight, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, TextInput, Text, Divider, Subheading } from 'react-native-paper';
import { Colors } from '../../styles';

const displayWidth = Dimensions.get('screen').width;

interface IModuleTypeChoice {
  objective: string,
  setObjective: React.Dispatch<React.SetStateAction<string>>,
  modules: string[],
  setChosenModuleType: React.Dispatch<React.SetStateAction<string>>,
  chosenModuleType: string,
  swiper: React.MutableRefObject<ScrollView | null>
}

export const ModuleTypeChoice: React.FC<IModuleTypeChoice> = ({ objective, setObjective, modules, setChosenModuleType, swiper, chosenModuleType }) => (
  <ScrollView 
    style={{width: displayWidth}} 
    contentContainerStyle={{justifyContent: 'center', alignContent: 'center'}}>

    <TextInput
      dense
      style={{margin: 10, marginVertical: 20}}
      label={I18n.t('moduleObjectiveLabel')}
      value={objective}
      onChangeText={setObjective}
      theme={{colors: {primary: Colors.primary}}} />
    <Divider/>

    <View style={{flex: 1, flexDirection: 'row', justifyContent:'center', marginBottom: 50}}>
  
      <View>
        <Subheading 
          style={{margin: 10, marginTop: 20, marginLeft: 20}}>
          {I18n.t('chooseModuleType')}
        </Subheading>
        {modules.map(m => 
          <ModuleCard 
            moduleType={m} 
            key={m} 
            setChosenModule={setChosenModuleType} 
            chosen={m === chosenModuleType}
            swiperRef={swiper}/>
          )
        }
      </View>
    </View>
  </ScrollView>
)

const ModuleCard: React.FC<{moduleType: string, setChosenModule: (arg0: string) => void, chosen: boolean, swiperRef: React.MutableRefObject<ScrollView | null>}> = ({ moduleType, setChosenModule, chosen, swiperRef }) => (
  <TouchableHighlight
      style={{maxWidth: 250, margin: 10, borderRadius: 5}}
      onPress={() => {
          setChosenModule(moduleType);
      }}>
      <Card 
          style={{padding: 0, backgroundColor: chosen ? Colors.primary : 'white', overflow: 'hidden'}}
          >
          <Card.Title 
              titleStyle={{color: chosen ? 'white' : 'black'}}
              title={I18n.t(moduleType + 'Name')} 
              />
          <Card.Content>
              <Text 
                  style={{color: chosen ? 'white' : 'black'}}
                  >{I18n.t(moduleType + 'Description')} </Text>
          </Card.Content>
      </Card>
  </TouchableHighlight>
  
)