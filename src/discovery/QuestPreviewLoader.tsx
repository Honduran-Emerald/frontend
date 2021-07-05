import React from 'react';
import { StyleSheet } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';
import { QuestPreview, QuestPreviewProps } from './QuestPreview';

type QuestPreviewLoaderProps = {
  loading: boolean,
  content: QuestPreviewProps | null
}


export const QuestPreviewLoader: React.FC<QuestPreviewLoaderProps> = ({ loading, content }) => (
    <SkeletonContent isLoading={loading}
        layout={[
            {key: 'a', width: styles.quest.width, height: 190, margin: styles.quest.margin, marginHorizontal: styles.quest.marginHorizontal}
        ]}>
            <QuestPreview {...content!}/>
        </SkeletonContent>
    )

    const styles = StyleSheet.create({
        quest: {
            margin: 1,
            marginHorizontal: 7,
            width: 150,
            borderWidth: 1,
            borderColor: '#0000'
        }
});
