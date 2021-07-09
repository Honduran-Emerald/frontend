import I18n from 'i18n-js';
import React from 'react';
import { Dimensions, TouchableHighlight, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, TextInput, Text, Divider, Subheading } from 'react-native-paper';
import { LevelLock } from '../../common/LevelLock';
import { Colors } from '../../styles';

const displayWidth = Dimensions.get('screen').width;

interface IModuleTypeChoice {
  modules: string[],
  setChosenModuleType: React.Dispatch<React.SetStateAction<string>>,
  chosenModuleType: string,
  swiper: React.MutableRefObject<ScrollView | null>
}

export const ModuleTypeChoice: React.FC<IModuleTypeChoice> = ({ modules, setChosenModuleType, swiper, chosenModuleType }) => (
  <ScrollView 
    style={{width: displayWidth}} 
    contentContainerStyle={{justifyContent: 'center', alignContent: 'center', marginVertical: 40}}>

    <View style={{flex: 1, flexDirection: 'row', justifyContent:'center', marginBottom: 150}}>
  
      <View>
        <Subheading 
          style={{margin: 10, marginTop: 20, marginLeft: 20}}>
          {I18n.t('chooseModuleType')}
        </Subheading>
        {modules.map(m => 
          <ModuleCard 
            key={m}
            moduleType={m} 
            setChosenModule={setChosenModuleType} 
            chosen={m === chosenModuleType}
            swiperRef={swiper}/>
          )
        }
      </View>
    </View>
  </ScrollView>
)

const ModuleCard: React.FC<{moduleType: string, setChosenModule: (arg0: string) => void, chosen: boolean, swiperRef: React.MutableRefObject<ScrollView | null>}> = ({ moduleType, setChosenModule, chosen }) => (
  <TouchableHighlight
    style={{maxWidth: 250, margin: 10, borderRadius: 5}}
    onPress={() => {
      setChosenModule(moduleType);
    }}>

    <LevelLock key={moduleType} permission={moduleType + 'Module'}>
    <Card 
      style={{padding: 0, backgroundColor: chosen ? Colors.primary : 'white', overflow: 'hidden'}}
      >
      <Card.Title 
        titleStyle={{color: chosen ? 'white' : 'black'}}
        title={I18n.t(moduleType + '_ModuleName')} 
        />
      <Card.Content>
        <Text 
          style={{color: chosen ? 'white' : 'black'}}
          >{I18n.t(moduleType + '_ModuleDescription')} 
        </Text>
      </Card.Content>
    </Card>
    </LevelLock>
  </TouchableHighlight>
)