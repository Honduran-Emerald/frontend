import React, { useState } from 'react';
import { Dimensions, Text } from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { Button, Card, Divider, Subheading, TextInput } from 'react-native-paper';
import i18n from 'i18n-js';
import '../translations';
import { CreateStoryModule } from './CreateStoryModule';
import { CreateEndModule } from './CreateEndModule';
import { CreateChoiceModule } from './CreateChoiceModule';
import { primary } from '../../styles/colors';
import { PrototypeComponent, PrototypeModule } from '../../types/quest';
import { useAppDispatch } from '../../redux/hooks';
import { useNavigation, useRoute } from '@react-navigation/core';
import { addOrUpdateQuestModule } from '../../redux/editor/editorSlice';
import StepIndicator from 'react-native-step-indicator';
import { View } from 'react-native';
import { Colors } from '../../styles';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { ModuleTypeChoice } from './ModuleTypeChoice';

const displayWidth = Dimensions.get('screen').width


export interface ICreateModule {
    setFinalModule: (finalModule: IModuleBase) => void
}

export interface IModuleBase {
    type: string,
    components: PrototypeComponent[],
    choices?: {
        text: string,
        nextModuleId: number | null,
    }[],
    endingFactor?: number,
}

export const CreateModuleScreen = () => {
 
    const [objective, setObjective] = useState('')
    const [chosenModuleType, setChosenModuleType] = useState('')
    const [finalModule, setFinalModule] = useState<PrototypeModule>();

    const route = useRoute();
    const navigation = useNavigation();

    const swiper = useRef<ScrollView | null>(null);

    const dispatch = useAppDispatch();

    const saveModule = (finalModule: IModuleBase) => {

        const baseModule = {
            //@ts-ignore
            id: route.params?.moduleId,
            objective: objective,
            components: [],
        }

        setFinalModule({...baseModule, ...finalModule})
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

    useEffect(() => {
        swiper.current?.scrollTo({
            x: 2 * displayWidth,
        });
    }, [finalModule])

    useEffect(() => {
        swiper.current?.scrollTo({
            x: displayWidth,
        });
    }, [chosenModuleType])
      

    return (
        <View style={{margin: 0, borderColor: 'black', flexGrow: 1}}>
            {/*<StepIndicator 
                customStyles={customStyles} 
                labels={['Choose\nModule Type', 'Choose Module Properties', 'Create\nModule']}
                currentPosition={currentIndex}
            stepCount={3}/>*/}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator
                ref={swiper}
            >
                <ModuleTypeChoice chosenModuleType={chosenModuleType} modules={modules} objective={objective} setChosenModuleType={setChosenModuleType} setObjective={setObjective} swiper={swiper}/>
                {chosenModuleType in moduleMap && 
                    <ScrollView style={{width: displayWidth, margin: 0, padding: 0}}>{moduleMap[chosenModuleType]}</ScrollView>
                }
                {finalModule &&  <View style={{width: displayWidth}}><View style={{flex: 1, margin: 20}} >
                    
                    <ScrollView 
                        style={{height: '100%'}}
                        contentContainerStyle={{justifyContent: 'space-between', }}>
                        <Text>
                            {JSON.stringify(finalModule)}
                        </Text>

                        <Button 
                            mode='contained' 
                            onPress={() => {
                                dispatch(addOrUpdateQuestModule(finalModule)) 
                                //@ts-ignore
                                route.params?.insertModuleId()
                                navigation.navigate('ModuleGraph')
                            }}
                            theme={{colors: {primary: primary}}}>
                            Save Module
                        </Button>
                    </ScrollView>
                </View></View>}
            </ScrollView>
        </View>
    )
}

const ModuleCard: React.FC<{moduleType: string, setChosenModule: (arg0: string) => void, chosen: boolean, swiperRef: React.MutableRefObject<ScrollView | null>}> = ({ moduleType, setChosenModule, chosen, swiperRef }) => (
    <TouchableHighlight
        style={{maxWidth: 250, margin: 10, borderRadius: 5}}
        onPress={() => {
            setChosenModule(moduleType);
        }}>
        <Card 
            style={{padding: 0, backgroundColor: chosen ? primary : 'white', overflow: 'hidden'}}
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