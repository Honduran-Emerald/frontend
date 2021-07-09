import React, { useEffect, useState } from 'react';
import { loadQuest } from '../redux/editor/editorSlice';
import { useAppDispatch } from '../redux/hooks';
import { QuestEditorNavigator } from './QuestEditorNavigator';

interface QuestCreatorWrapperProps {
  route: {
    key: string,
    name: string,
    params: {
      screen: string,
      params: {
        latitude: number,
        longitude: number,
      },
    },
  },
}

export const QuestCreatorWrapper : React.FC<QuestCreatorWrapperProps> = ({ route }) => {

  const [questCreated, setQuestCreated] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadQuest({
      questId: '',
      questPrototype: {
        id: '',
        title: '',
        description: '',
        tags: [],
        locationName: '',
        location: {
          latitude: route.params.params.latitude,
          longitude: route.params.params.longitude
        },
        imageReference: null,
        approximateTime: '',
        agentProfileReference: null,
        agentProfileName: '',
        agentEnabled: false,
        firstModuleReference: 1,
        modules: [],
        images: []
      }
    }));
    setQuestCreated(true);
  }, [])

  return (
    <>
      {questCreated && <QuestEditorNavigator />}
    </>
  )
}
