import React, { useEffect, useState } from 'react';
import { loadQuest } from '../redux/editor/editorSlice';
import { useAppDispatch } from '../redux/hooks';
import { Location } from '../types/general';
import { createQuestRequest } from '../utils/requestHandler';
import { QuestEditorNavigator } from './QuestEditorNavigator';

export const QuestCreatorWrapper : React.FC<Location> = ({ latitude, longitude }) => {

  const [questCreated, setQuestCreated] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    createQuestRequest('THIS', 'IS', 'ONLY ', latitude, longitude, 'TEMPORARY', 'FUCK', [])
      .then(r => r.json())
      .then(r => dispatch(loadQuest({questId: r.questId, questPrototype: {
        id: r.questPrototype.id,
        approximateTime: '',
        creationTime: '',
        description: '',
        firstModuleId: 0,
        imageId: '',
        location: {
          latitude: latitude,
          longitude: longitude
        },
        locationName: '',
        modules: [],
        profileImageId: '',
        profileName: '',
        tags: [],
        title: ''
      }})))
      .then(() => setQuestCreated(true))
  }, [])

  return (
    <>
      {questCreated && <QuestEditorNavigator />}
    </>
  )
}