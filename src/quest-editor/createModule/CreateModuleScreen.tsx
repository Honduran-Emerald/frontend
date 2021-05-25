import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Caption, Card, Divider, Headline, Paragraph, Subheading, TextInput, Title } from 'react-native-paper';
import i18n from 'i18n-js';
import '../translations';
import { CreateStoryModule } from './CreateStoryModule';
import { CreateEndModule } from './CreateEndModule';
import { CreateChoiceModule } from './CreateChoiceModule';


export interface ICreateModule {
    setFinalModule: (finalModule: object) => void
}

export const CreateModuleScreen = () => {

    const [moduleName, setModuleName] = useState('')
    const [chosenModuleType, setChosenModuleType] = useState('')
    const [finalModule, setFinalModule] = useState();

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
        <ScrollView>
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
                {modules.map(m => <ModuleCard moduleType={m} key={m} setChosenModule={setChosenModuleType}/>)}
            </ScrollView>
            <Divider style={{marginVertical: 10}}/>
            {chosenModuleType in moduleMap && moduleMap[chosenModuleType]}
        </ScrollView>
    )
}

const ModuleCard: React.FC<{moduleType: string, setChosenModule: (arg0: string) => void}> = ({ moduleType, setChosenModule }) => (
    <Card 
        style={{maxWidth: 200, margin: 10}}
        onPress={() => setChosenModule(moduleType)}>
        <Card.Title 
            title={i18n.t(moduleType + 'Name')} 
            />
        <Card.Content>
            <Text>{i18n.t(moduleType + 'Description')} </Text>
        </Card.Content>
    </Card>
)