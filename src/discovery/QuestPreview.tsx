import { LocationObject } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { GameplayQuestHeader } from '../types/quest';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDistanceFromLatLonInKm } from './locationUtils';
import { useNavigation } from '@react-navigation/native';
import { getImageAddress } from '../utils/imageHandler';
import { Colors } from '../styles';
import Svg, { Path } from 'react-native-svg';

export interface QuestPreviewProps {
  quest: GameplayQuestHeader
  location: LocationObject | undefined
}

export const QuestPreview: React.FC<QuestPreviewProps> = ({quest, location}) => {

  const [distance, setDistance] = useState('');
  
  useEffect(() => {
      location && quest.location &&
      setDistance(getDistanceFromLatLonInKm(quest.location.latitude, quest.location.longitude, location.coords.latitude, location.coords.longitude));
  }, [location])

  const move = quest.votes.toString().length * 11

  /**
   * The numbers, what do they mean??
   * 
   * Am besten du fragst lenny aber wenn du die kurzversion willst. Dat sind parameter zum Anzeigen von den Bezierkurven vom Votes Tag.
   * Die koordinaten von den Punkten der Kurve sind dabei 
   * - (a, 0)
   * - (b, c)
   * - (d, e)
   * - (0, f)
   * 
   * x und y definieren die ausbreitung entlang der bezier kurve
   */

  const a = 100 + move;
  const b = 50 + move;
  const c = 15;
  const d = 20 + move/2;
  const e = 38;
  const f = 60;

  const x = [30, 40, 100];
  const y = [20, 20, 10];

  const navigation = useNavigation();

  return(
          <Card style={styles.quest} onPress={() => navigation.navigate('QuestDetail', {quest: quest})}>
              <Card.Cover style={styles.pic} source={quest.imageId != null ? {uri: getImageAddress(quest.imageId, '')} : require('../../assets/background.jpg')} resizeMode='stretch' />
              <Card.Title style={styles.content} titleStyle={styles.title} titleNumberOfLines={2} title={quest.title} />
              
              <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                      marginTop: -10
                  }}>
                  <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons name='map-marker-distance' color={Colors.primary} style={{paddingRight: 5}}/>
                      <Text style={styles.bLabel}>
                          {distance}
                      </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                      <Text style={styles.bLabel}>
                          {quest.approximateTime}
                      </Text>
                      <MaterialCommunityIcons name='clock-time-five' color={Colors.primary} style={{paddingLeft: 5}}/>
                  </View>
              </View>
              
              <View style={{
                      flexDirection: 'row-reverse',
                      marginBottom: 5,
                      paddingHorizontal: 5,
                      alignItems: 'center',
                      borderStyle: 'dashed',
                      borderTopWidth: 1,
                      borderColor: Colors.gray,
                      paddingTop: 5,
                  }}>

                      <Avatar.Image
                          size={30}
                          theme={{colors: {primary: Colors.primary}}}
                          source={{uri: getImageAddress(quest.ownerImageId, quest.ownerName)}}
                      />
                      <View style={{flexGrow: 1, alignItems: 'center'}}>
                          <Text style={{fontSize: 10, color: Colors.black}}>
                              {quest.ownerName}
                          </Text>
                      </View>
                              
                  </View>

              <View style={{position: 'absolute'}}>
                  <Svg
                      width="130"
                      height="130"
                      fill={Colors.background}
                      stroke={Colors.lightGray}
                      viewBox="0 0 200 200"
                      opacity='0.6'
                      >
                      {/* Symmetric: 'M 0 0 M 75 0 C 60 0, 50 10, 50 25 C 50 40, 40 50, 25 50 C 10 50, 0 60, 0 75 L 0 0' */}
                      {/*      Start   [TR ]            ^  [TM ]       |         [BM ]                [BE]   */}
                      {/*      Start   wdt 0   <- 0  XX |  XX YY   XX  v         [BM ]                [BE]   */}
                      {/*     'M 0 0 M 125 0 C 90 0, 70 2, 70 20 C 70 35, 60 40, 25 40 C 0 40, 0 60, 0 75 L 0 0'*/}
                      {/* 
                      
                      Three Fixed Points
                      `
                                  M 0 0 
                                  M ${a} 0
                                  C ${a - x[0]} 0, ${b} ${c-y[0]}, ${b} ${c}
                                  C ${b} ${c+y[1]}, ${d+x[1]} ${e}, ${d} ${e}
                                  C ${d-x[2]} ${e}, 0 ${f-y[2]}, 0 ${f}
                                  L 0 0`

                      */}
                      <Path d={`
                                  M 0 0 
                                  M ${a} 0
                                  C ${a - x[0]} 0, ${b} ${c-y[0]}, ${b} ${c}
                                  C ${b} ${c+y[1]}, ${d+x[1]} ${e}, ${d} ${e}
                                  L 0 ${e}
                                  L 0 0`}
                          strokeWidth='0'
                          
                      />
                  </Svg>
                  <View style={{
                      position: 'absolute', 
                      width: b*130/200, 
                      height: e*130/200, 
                      paddingHorizontal: 5,
                      flexDirection: 'row', 
                      alignItems: 'center',
                      alignContent: 'center', 
                      justifyContent: 'center', 
                      overflow: 'hidden'}}>
                  <Text style={{fontSize: 13, color: Colors.primary, fontWeight: 'bold'}} ellipsizeMode={'head'} numberOfLines={1}>{quest.votes} </Text>
                  <MaterialCommunityIcons name='thumbs-up-down' color={Colors.primary}/>
                  </View>

              </View>
          </Card>
  )
}

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
