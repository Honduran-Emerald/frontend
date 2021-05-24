import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Caption, Card, Divider, Headline, Paragraph, TextInput, Title } from 'react-native-paper';
import i18n from 'i18n-js';
import './translations';

export const CreateModuleScreen = () => {

    const [moduleName, setModuleName] = useState('')

    const modules = [
        'positionModule',
        'choiceModule',
        'storyModule',
        'endModule'
    ]

    return (
        <ScrollView>
            <TextInput
                style={{margin: 10, marginVertical: 20}}
                label={i18n.t('moduleObjectiveLabel')}
                value={moduleName}
                onChangeText={setModuleName} />
            <Divider/>
            <Title 
                style={{margin: 10, marginTop: 20}}>
                {i18n.t('chooseModuleType')}
            </Title>

            <ScrollView horizontal>
                {modules.map(m => <ModuleCard moduleType={m} key={m}/>)}
            </ScrollView>
            <Divider style={{marginVertical: 10}}/>
        </ScrollView>
    )
}

const ModuleCard: React.FC<{moduleType: string}> = ({ moduleType }) => (
    <Card style={{maxWidth: 200, margin: 10}}>
        <Card.Title 
            title={i18n.t(moduleType + 'Name')} 
            />
        <Card.Content>
            <Text>{i18n.t(moduleType + 'Description')} </Text>
        </Card.Content>
    </Card>
)