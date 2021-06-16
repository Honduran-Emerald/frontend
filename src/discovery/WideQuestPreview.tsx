import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Button, Card, Title } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { getDistanceFromLatLonInKm, questProps } from './ScrollMenu';
import { Colors } from '../styles';

export const WideQuestPreview = (props:questProps) => {

  const [distance, setDistance] = useState(-1);

  useEffect(() => {
    props.location &&
    setDistance(getDistanceFromLatLonInKm(props.quest.location.latitude, props.quest.location.longitude, props.location.coords.latitude, props.location.coords.longitude));
  }, [props.location])

  const navigation = useNavigation();

  return(
    <Card style={styles.quest}>
      <Card.Cover style={styles.pic} source={require('../../assets/background.jpg')}/>
      <Card.Content>
        <Title style={styles.title} numberOfLines={2}>{props.quest.title}</Title>
        <Text style={styles.description} numberOfLines={4}>{props.quest.description}</Text>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <View>
          <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>{distance}</Button>
          <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>{props.quest.votes}</Button>
        </View>
        <View>
          <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>{props.quest.approximateTime}</Button>
          <Button compact contentStyle={styles.bContent} labelStyle={styles.bLabel}>{props.quest.ownerName}</Button>
        </View>
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  quest: {
    margin: 1,
    marginHorizontal: 7,
    width: '90%',
  },
  pic: {
    height: 80,
  },
  title: {
    marginTop: 10,
    fontSize: 15,
  },
  description: {
    fontSize: 14,
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
