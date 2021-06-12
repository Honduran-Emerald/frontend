import React, { useState } from 'react';
import { Text } from 'react-native';
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
import Swiper from 'react-native-swiper';
import StepIndicator from 'react-native-step-indicator';
import { View } from 'react-native';
import { Colors } from '../../styles';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';


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

    const [currentIndex, setCurrentIndex] = useState(0);

    const route = useRoute();
    const navigation = useNavigation();

    const swiper = React.createRef<Swiper>();

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

    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize:30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: Colors.primary,
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: Colors.primary,
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: Colors.primary,
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: Colors.primary,
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: Colors.primary,
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: Colors.primary,
      }

    
    useLayoutEffect(() => {
        swiper.current?.scrollTo(1)
    }, [chosenModuleType])
      

    return (
        <View style={{margin: 0, borderColor: 'black', borderWidth: 1, flexGrow: 1}}>
            {/*<StepIndicator 
                customStyles={customStyles} 
                labels={['Choose\nModule Type', 'Choose Module Properties', 'Create\nModule']}
                currentPosition={currentIndex}
            stepCount={3}/>*/}
            <Swiper 
                ref={swiper}
                showsButtons={false}
                
                showsPagination={false}
                
                loop={false}
                onIndexChanged={(i) => setTimeout(() => {console.log(i); setCurrentIndex(i)},0)}>
                    <ScrollView style={{flex: 1, }} 
                        contentContainerStyle={{justifyContent: 'center', alignContent: 'center'}}>
                        <TextInput
                            dense
                            style={{margin: 10, marginVertical: 20}}
                            label={i18n.t('moduleObjectiveLabel')}
                            value={objective}
                            onChangeText={setObjective}
                            theme={{colors: {primary: primary}}} />
                        <Divider/>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent:'center', marginBottom: 50}}>
                        
                            <View>
                                <Subheading 
                                    style={{margin: 10, marginTop: 20, marginLeft: 20}}>
                                    {i18n.t('chooseModuleType')}
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
                    {chosenModuleType in moduleMap && 
                        <ScrollView>{moduleMap[chosenModuleType]}</ScrollView>
                    }
                    {finalModule && <View style={{flex: 1, margin: 20}} >
                        
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
                    </View>}
                </Swiper>
        </View>
    )
}

const ModuleCard: React.FC<{moduleType: string, setChosenModule: (arg0: string) => void, chosen: boolean, swiperRef: React.RefObject<Swiper>}> = ({ moduleType, setChosenModule, chosen, swiperRef }) => (
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