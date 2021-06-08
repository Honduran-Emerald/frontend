import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ModuleGraphCaller } from './graph/ModuleGraphCaller';
import { QuestEditor } from './QuestEditor';
import { createGetRequest } from '../utils/requestHandler';
import { loadQuest, unloadQuest } from '../redux/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RouteProp, useRoute } from '@react-navigation/core';
import { SvgDemo } from './graph/SvgAnimationDemo';
import { CreateModuleScreen } from './createModule/CreateModuleScreen';
import i18n from 'i18n-js';
import { editorTranslations } from './translations'
import { MyQuestList } from './MyQuestList';

const Stack = createStackNavigator();

export const QuestEditorNavigator = () => {

  i18n.translations = editorTranslations
  i18n.fallbacks = true

  const route = useRoute<RouteProp<{ params: {
      questId: string
  }}, 'params'>>();

  const questPrototype = useAppSelector((state) => state.editor.questPrototype)
  const dispatch = useAppDispatch()

  useEffect(() => {
      if (!(questPrototype && questPrototype.id === route.params.questId)) {
        dispatch(unloadQuest());
        createGetRequest(route.params.questId)
          .then(q => q.json())
          //.then(questDeep => dispatch(loadQuest(questDeep.questPrototype)))
          //.catch(() => {console.log('Error parsing create/query endpoint (file QuestEditorNavigator.tsx)')});
          .then(q => dispatch(loadQuest(
            {
              "title": "Lenn's Quest",
              "description": "Lenn's Quest. Do Not Touch >:v",
              "tags": [
                "lenn",
                "broken"
              ],
              "locationName": "FFM",
              "location": {
                "longitude": 9.651041,
                "latitude": 49.873179
              },
              "imageId": "3",
              "approximateTime": "Infinity",
              "profileImageId": '',
              "profileName": '',
              'creationTime': 'now',
              "firstModuleId": 1,
              "modules": [
                {
                  "choices": [
                    {
                      "text": "Heim gehen",
                      "nextModuleId": 2
                    },
                    {
                      "text": "Zu Ihm gehen",
                      "nextModuleId": null
                    },
                    {
                      "text": "Zu Ihm gehen",
                      "nextModuleId": null
                    },
                    
                  ],
                  "id": 1,
                  "components": [
                    {
                      "text": "Schwör, was **geht?**",
                      "type": "Text"
                    },
                    {
                      "text": "Komma rüber!",
                      "type": "Text"
                    }
                  ],
                  "objective": "Go to Luisenplatz",
                  "type": "Choice"
                },
                {
                  "nextModuleId": 3,
                  "id": 2,
                  "components": [
                    {
                      "text": "Nein mann, ich will doch schon gehen",
                      "type": "Answer"
                    },
                    {
                      "text": "Ja mann",
                      "type": "Text"
                    }
                  ],
                  "objective": "Klimax",
                  "type": "Story"
                },
                {
                  "endingFactor": 0,
                  "id": 3,
                  "components": [
                    {
                      "text": "Jo jo, bin unterwegs",
                      "type": "Answer"
                    },
                    {
                      "text": "Schwör ich warte",
                      "type": "Text"
                    }
                  ],
                  "objective": "Message from Thomas",
                  "type": "Ending"
                }
              ],
              "id": "60b56058d81fb234791b9ea2"
            }
          )) )
      }
  }, [route.params.questId])

  return (
    <Stack.Navigator
      screenOptions={(route) => ({
        headerShown: true
      })}
    >
      <Stack.Screen name='QuestOverview' initialParams={{questId: '60b4ede42606263e2022e785'}}>
        {(props) => <QuestEditor/>}
      </Stack.Screen>
      <Stack.Screen name='ModuleGraph' component={ModuleGraphCaller}/>
      <Stack.Screen name='SvgDemo' component={SvgDemo}/>
      <Stack.Screen name='CreateModule' component={CreateModuleScreen} options={{headerTitle: i18n.t('createModuleTitle')}}/>
      <Stack.Screen name='ModulesList' component={MyQuestList}/>
    </Stack.Navigator>
  );
};