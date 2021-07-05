import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, StatusBar } from 'react-native';
import { Button, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule } from '../CreateModuleScreen';
import i18n from 'i18n-js';
import { primary } from '../../../styles/colors';
import { Colors } from '../../../styles';
import I18n from 'i18n-js';
import { PrototypeLocationModule } from '../../../types/prototypes';
import { useNavigation } from '@react-navigation/native';
import { Location } from '../../../types/general';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ILocationModuleData {
    objective: string,
    targetLocation: Location | null
}

export const LocationModule: React.FC<ICreateModule<PrototypeLocationModule>> = ({ setFinalModule, edit, defaultValues, setComponents, scrollToPreview }) => {

    const [moduleData, setModuleData] = useState<ILocationModuleData>(edit 
        ? {
            objective: defaultValues?.objective || '',
            targetLocation: defaultValues?.location || null
        } : {
            objective: '',
            targetLocation: null
        });

    useEffect(() => {
      if (!edit) {
          setComponents([
              {
                  type: 'Text',
                  text: ''
              }
          ])
      }
      }, [])

    const navigation = useNavigation();

    const parseToModule = (moduleData: ILocationModuleData): PrototypeLocationModule => {
        return ({
            id: -1,
            objective: moduleData.objective,
            type: 'Location',
            components: [],
            nextModuleReference: (edit && defaultValues) ? defaultValues.nextModuleReference : null,
            location: moduleData.targetLocation!
        })
    }

    useEffect(() => {
      setFinalModule(parseToModule(moduleData))
    }, [moduleData])

    return (
        <View style={{marginHorizontal: 10}}>
            <TextInput
                dense
                style={{marginVertical: 20}}
                label={I18n.t('moduleObjectiveLabel')}
                value={moduleData.objective}
                onChangeText={(data) => setModuleData({...moduleData, objective: data})}
                theme={{colors: {primary: Colors.primary}}} />
            <Divider/>
            <Subheading 
                style={{margin: 10, marginTop: 20}}>
                Choose Target Location
            </Subheading>
            <Divider/>
            {moduleData.targetLocation && 
                <View style={styles.mapContainer}>
                <MapView 
                    showsCompass={false}
                    zoomEnabled={false}
                    scrollEnabled={false}
                    rotateEnabled={false}
                    style={styles.map}
                    showsPointsOfInterest={true}
                    region={{
                      latitude: moduleData.targetLocation.latitude,
                      longitude: moduleData.targetLocation.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01
                    }}>

                    <Marker coordinate={moduleData.targetLocation} tracksViewChanges={false}>
                        <View>
                            <MaterialCommunityIcons name='map-marker-question' size={40} color={Colors.primary}/>
                        </View>
                    </Marker>
                    
                    </MapView>
                </View>
                
            
            }
            <Button 
                theme={{colors: {primary: primary}}}
                mode='contained'
                style={{marginBottom: 20}}
                onPress={() => {navigation.navigate('LocationPicker', {
                        returnLocation: (location: Location) => {
                            setModuleData({...moduleData, targetLocation: location})
                        }
                    }) /* TODO: Add Module Preprocessing here as soon as module structure is fully defined. Don't forget it */}}>
                Pick Location
            </Button>

            <Divider />
            
            <Button 
                theme={{colors: {primary: primary}}}
                mode='contained'
                style={{marginBottom: 20, marginTop: 20}}
                disabled={moduleData.targetLocation === null}
                onPress={scrollToPreview} >
                {i18n.t('createModuleButton')}
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      marginTop: 10,
    },
    mapContainer: {
      marginVertical: 10,
      width: '100%',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.gray,
      overflow: 'hidden',
    },
    map: {
      width: '100%',
      height: Dimensions.get('window').height * 0.25,
    },
    continue: {
      backgroundColor: Colors.primaryLight,
      alignItems: 'center',
      borderRadius: 50,
      padding: 10,
      margin: 5,
      marginTop: 10,
    },
    text: {
      color: '#fff',
    },
    modal: {
      backgroundColor: Colors.background,
      height: Dimensions.get('screen').height,
      marginTop: StatusBar.currentHeight,
    },
    modalMap: {
      width: '100%',
      height: '100%',
    },
    header: {
      alignItems: 'flex-start',
      borderBottomWidth: 1,
      paddingTop: 29,
      paddingLeft: 4,
      paddingVertical: 5,
      borderColor: Colors.gray,
    },
    backButton: {
      backgroundColor: 'transparent',
      borderRadius: 100,
      padding: 10,
    },
    touchContainer: {
      borderRadius: 100,
      overflow: 'hidden',
    },
    rounded: {
      borderRadius: 100,
    },
    completedView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    completedIcon: {
      marginLeft: -5,
    },
  });
  