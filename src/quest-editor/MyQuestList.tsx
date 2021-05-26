import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createQueryRequest } from '../utils/requestHandler';

export const MyQuestList: React.FC = () => {

    const [questsIds, setQuestsIds] = useState<string[]>([]);

    useEffect(() => {
        createQueryRequest(0)
            .then(x => x.json())
            .then(setQuestsIds)
    }, [])

    return (
        <View>
            <Text>{JSON.stringify(questsIds)}</Text>
        </View>
    )

}