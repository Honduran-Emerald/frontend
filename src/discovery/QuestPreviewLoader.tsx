import React from 'react';
import { StyleSheet } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';
import { Colors } from '../styles';
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
    header: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 5,
        marginLeft: 5,
    },
    surface: {
        margin: 0,
        padding: 10,
        paddingHorizontal: 0,
        height: 240,
    },
    quest: {
        margin: 1,
        marginHorizontal: 7,
        width: 150,
        borderWidth: 1,
        borderColor: '#0000'
    },
    pic: {
        height: 80,
    },
    title: {
        fontSize: 12,
        lineHeight: 15,
    },
    content: {
        marginLeft: -10,
        marginTop: -5,
    },
    bContent: {
        width: 75,
        margin: -5,
    },
    bLabel: {
        fontSize: 10,
        color: Colors.primary,
    },
    actions: {
        marginTop: 4,
    },
});
