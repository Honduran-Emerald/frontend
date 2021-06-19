import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Button, Card, Title } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { getDistanceFromLatLonInKm, questProps } from './ScrollMenu';
import { Colors } from '../styles';
import { BACKENDIP } from '../../GLOBALCONFIG';


export const WideQuestPreview = (props:questProps) => {

  const [distance, setDistance] = useState("");

  useEffect(() => {
    props.location &&
    setDistance(getDistanceFromLatLonInKm(props.quest.location.latitude, props.quest.location.longitude, props.location.coords.latitude, props.location.coords.longitude));
  }, [props.location])

  const navigation = useNavigation();

  return(
    <Card style={styles.quest} onPress={() => navigation.navigate('QuestDetail', {quest: props.quest})}>
      <View style={{flexDirection: 'row'}}>
        {
          props.quest.imageId &&
          <Card.Cover style={styles.pic} source={{uri: `${BACKENDIP}/image/get/${props.quest.imageId}`}}/>
        }
        {
          !props.quest.imageId &&
          <Card.Cover style={styles.pic} source={require('../../assets/background.jpg')}/>
        }
        <Card.Content>
          <Title style={styles.title} numberOfLines={2}>{props.quest.title}</Title>
          <Text style={styles.description} numberOfLines={4}>{props.quest.description}</Text>
        </Card.Content>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Card.Actions style={styles.actions}>
            <Button compact labelStyle={styles.bLabel} style={styles.button}>{distance}</Button>
            <Button compact labelStyle={styles.bLabel} style={styles.button}>{props.quest.votes} Votes</Button>
            <Button compact labelStyle={styles.bLabel} style={styles.button}><Entypo name='stopwatch' size={10} color={Colors.primary}/> {props.quest.approximateTime}</Button>
            <Button compact labelStyle={styles.bLabel} style={styles.button}>{props.quest.ownerName}</Button>
        </Card.Actions>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  quest: {
    margin: 5,
    width: '98%',
  },
  pic: {
    height: '100%',
    width: '25%'
  },
  title: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 15,
    marginRight: 80,
    lineHeight: 20,
    marginLeft: -10,
  },
  description: {
    fontSize: 14,
    marginRight: 80,
    marginLeft: -10,
    marginBottom: 5,
  },
  bLabel: {
    fontSize: 10,
    color: Colors.primary,
  },
  actions: {
    width: '100%',
    justifyContent: 'space-evenly'
  },
  button: {
  }
});
