import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { Card, Divider, Subheading, TextInput } from 'react-native-paper';
import i18n from 'i18n-js';
import '../translations';
import { CreateStoryModule } from './CreateStoryModule';
import { CreateEndModule } from './CreateEndModule';
import { CreateChoiceModule } from './CreateChoiceModule';
import { primary } from '../../styles/colors';
import { PrototypeComponent } from '../../types/quest';


export interface ICreateModule {
    setFinalModule: (finalModule: object) => void
}

export const CreateModuleScreen = () => {

    const [moduleName, setModuleName] = useState('')
    const [chosenModuleType, setChosenModuleType] = useState('')
    const [finalModule, setFinalModule] = useState();
    const [components, setComponents] = useState<PrototypeComponent[]>([]);

    const saveModule = (finalModule: object) => {
        console.log({...finalModule, moduleName: moduleName})
    }

    const modules = [
        'positionModule',
        'choiceModule',
        'storyModule',
        'endModule'
    ]

    const moduleMap: {[moduleName: string]: JSX.Element} = {
        'storyModule': <CreateStoryModule setFinalModule={saveModule}/>,
        'endModule': <CreateEndModule setFinalModule={saveModule}/>,
        'choiceModule': <CreateChoiceModule setFinalModule={saveModule}/>
    }

    return (
        <View>
            <TextInput
                dense
                style={{margin: 10, marginVertical: 20}}
                label={i18n.t('moduleObjectiveLabel')}
                value={moduleName}
                onChangeText={setModuleName} />
            <Divider/>
            <Subheading 
                style={{margin: 10, marginTop: 20, marginLeft: 20}}>
                {i18n.t('chooseModuleType')}
            </Subheading>

            <ScrollView horizontal>
                {modules.map(m => <ModuleCard moduleType={m} key={m} setChosenModule={setChosenModuleType} chosen={m === chosenModuleType}/>)}
            </ScrollView>

            {/*<ComponentChoice components={components} setComponents={setComponents}/>*/}

            <Divider style={{marginVertical: 10}}/>
            {chosenModuleType in moduleMap && moduleMap[chosenModuleType]}
        </View>
    )
}

const ModuleCard: React.FC<{moduleType: string, setChosenModule: (arg0: string) => void, chosen: boolean}> = ({ moduleType, setChosenModule, chosen }) => (
    <TouchableHighlight
        style={{margin: 10, borderRadius: 5}}
        onPress={() => setChosenModule(moduleType)}>
        <Card 
            style={{maxWidth: 200, padding: 0, backgroundColor: chosen ? primary : 'white', overflow: 'hidden'}}
            >
            <Card.Title 
                titleStyle={{color: chosen ? 'white' : 'black'}}
                title={i18n.t(moduleType + 'Name')} 
                />
            <Card.Content>
                <Text 
                    style={{color: chosen ? 'white' : 'black'}}
                    >{i18n.t(moduleType + 'Description')} </Text>
            </Card.Content>
        </Card>
    </TouchableHighlight>
    
)