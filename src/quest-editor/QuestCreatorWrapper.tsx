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
    createQuestRequest('Phisn erlaube endlich null values', 'Phisn plssssss', 'amkphisnmachdoch', latitude, longitude, 'phisn pls fix', 'fix phisn', ['phisn', 'fix'])
      .then(r => r.json())
      .then(r => dispatch(loadQuest(r.questPrototype)))
      .then(() => setQuestCreated(true))
  }, [])

  return (
    <>
      {questCreated && <QuestEditorNavigator />}
    </>
  )
}