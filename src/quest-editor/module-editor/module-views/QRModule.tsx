import React, { useState } from 'react';
import { Dimensions, Text, TouchableHighlight, View } from 'react-native';
import { Button, Subheading, TextInput, Divider } from 'react-native-paper';
import { ICreateModule, IModuleBase } from '../CreateModuleScreen';
import i18n from 'i18n-js';
import { primary } from '../../../styles/colors';
import { Colors } from '../../../styles';
import I18n from 'i18n-js';
import { PrototypeComponent, PrototypePassphraseModule, PrototypeQRModule, PrototypeStoryModule, PrototypeTextComponent } from '../../../types/prototypes';
import { ComponentCreator } from '../ComponentCreator';
import { useEffect } from 'react';
import QRCode from 'react-native-qrcode-svg';
import uuid from 'react-native-uuid';
import { useRef } from 'react';
import * as Sharing from 'expo-sharing';
import * as FileSystem from "expo-file-system";
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';


interface IQRModule {
    objective: string,
}

export const QRModule: React.FC<ICreateModule<PrototypeQRModule>> = ({ setFinalModule, edit, defaultValues, setComponents, scrollToPreview }) => {

    const ref = useRef<QRCode>(null);

    const [moduleData, setModuleData] = useState<IQRModule>(edit 
        ? {
            objective: defaultValues?.objective || '',
        } : {
            objective: ''
        });

    const [code, setCode] = useState<string>(edit ? defaultValues?.text || uuid.v4() as string : uuid.v4() as string)

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

    const parseToModule = (moduleData: IQRModule): PrototypeQRModule => {
        return ({
            id: -1,
            objective: moduleData.objective,
            type: 'QrCode',
            components: [],
            text: code,
            nextModuleReference: (edit && defaultValues) ? defaultValues.nextModuleReference : null
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
                {/* i18n.t('addStoryText') */ 'Generate a QR code. The user will need to scan this code to progress. Make sure that the user can find this code.'}
            </Subheading>

            <TouchableWithoutFeedback
                onPress={() => {
                    //TODO: Open Modal with QRCode here
                }}
            >
                <View style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    alignItems: 'center',
                    marginVertical: 20,
                    borderRadius: 10,
                }}>
                    <QRCode
                        logoMargin={-3}
                        value={code}
                        backgroundColor={Colors.black}
                        size={Dimensions.get('screen').width - 80}
                        logo={require('../../../../assets/adaptive-icon.png')}
                        logoBorderRadius={10}
                        logoSize={60}
                        logoBackgroundColor={Colors.black}
                        quietZone={15}
                        //@ts-ignore
                        getRef={(c) => {ref.current = c}}
                        enableLinearGradient={true}
                        linearGradient={
                            ['#009CFF', '#DE52FF']
                        }
                        gradientDirection={['0.5', '0', '0.5', '1']}
                        ecl='H'
                        />
                </View>
            </TouchableWithoutFeedback>

            <Button 
                theme={{colors: {primary: primary}}}
                mode='contained'
                icon='share'
                style={{marginBottom: 20}}

                //@ts-ignore
                onPress={() => {
                    //@ts-ignore
                    ref.current?.toDataURL(async (data) => {
                        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'HonaQR.png', data, {
                            encoding: FileSystem.EncodingType.Base64
                        })
                        await Sharing.shareAsync(FileSystem.documentDirectory + 'HonaQR.png')
                    })
                    }}>
                {'Share QR Code'}
            </Button>

            {/* <Text>{moduleData.code}</Text> */}

            <Button 
                theme={{colors: {primary: primary}}}
                mode='contained'
                icon='reload-alert'
                style={{marginBottom: 20}}

                //@ts-ignore
                onPress={() => setCode(uuid.v4())}>
                {'Regenerate QR Code'}
            </Button>

            <Divider/>

            <Button 
                theme={{colors: {primary: primary}}}
                mode='contained'
                style={{marginBottom: 20}}

                onPress={scrollToPreview}>
                {i18n.t('createModuleButton')}
            </Button>
        </View>
    )
}