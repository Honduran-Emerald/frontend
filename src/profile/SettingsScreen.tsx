import React, { useEffect, useState } from 'react';
import {StatusBar as StatusBar2, StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileTop } from './ProfileTop';
import { Colors } from '../styles';
import { ScrollMenu } from "../discovery/ScrollMenu";
import { StatusBar } from "expo-status-bar";
import { getLocation } from "../utils/locationHandler";
import { QuestHeader } from "../types/quest";
import { queryQuestsRequest } from "../utils/requestHandler";
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {deleteItemLocally} from "../utils/SecureStore";
import {logout} from "../redux/authentication/authenticationSlice";
import {clearQuestState} from "../redux/quests/questsSlice";
import {Button, Divider} from "react-native-paper";
import {removeData} from "../utils/AsyncStore";
import Constants from 'expo-constants';


export default interface settingsProps {
    ownProfile: boolean
}

export const SettingsScreen = (props: settingsProps) => {
    const insets = useSafeAreaInsets();

    const [openDisclosure, setOpenDisclosure] = React.useState(false);

    const disclosure = () => setOpenDisclosure(!openDisclosure);

    const location = useAppSelector(state => state.location.location)
    const user = useAppSelector((state) => state.authentication.user);

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        deleteItemLocally('UserToken').then(() => {}, () => {});
        removeData('PinnedQuestTracker').then(() => {}, () => {});
        removeData('RecentlyVisitedQuests').then(() => {}, () => {});
        dispatch(logout())
        dispatch(clearQuestState())
    }

    return(
        <View style={[style.screen, { marginBottom: insets.bottom}]}>
            <ScrollView contentContainerStyle={style.settings}>
                <Image source={require('../../assets/Logo_Full_Black.png')} style={{width: Dimensions.get('screen').width, height: 170, borderWidth: 10, alignSelf: 'center'}} resizeMethod='resize' />
                <Divider/>
                <Button icon={'logout-variant'} color={'#1D79AC'} onPress={handleLogout} contentStyle={{height: 100}}> Logout </Button>
                <Divider/>
                <Button color={'#1D79AC'} onPress={disclosure} contentStyle={{height: 100}}> Legal Disclosure </Button>
                <Divider/>
                {
                    openDisclosure &&
                    <><View style={{margin: 10}}>
                        <Text>
                            We are doing our best to prepare the content of this app.
                            However, Hona cannot warranty the expressions and suggestions of the contents, as well as its accuracy.
                            In addition, to the extent permitted by the law, Hona shall not be responsible for any losses and/or damages due to the usage of the information on our app.
                            Our Disclaimer was generated with the help of the App Disclaimer Generator from App-Privacy-Policy.com.
                        </Text>
                        <Text>
                            By using our app, you hereby consent to our disclaimer and agree to its terms.
                            Any links contained in our app may lead to external sites are provided for convenience only.
                            Any information or statements that appeared in these sites or app are not sponsored, endorsed, or otherwise approved by Hona.
                            For these external sites, Hona cannot be held liable for the availability of, or the content located on or through it.
                            Plus, any losses or damages occurred from using these contents or the internet generally.
                        </Text>
                    </View>
                    <Divider/></>
                }
                <Text style={{height: 100, textAlign: 'center', textAlignVertical: 'center', color: Colors.gray}}>
                    Hona Version {Constants.manifest.version}
                </Text>
                <Divider/>

            </ScrollView>
            <StatusBar style="auto"/>
        </View>
    );
}

const style = StyleSheet.create({
    screen: {
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: Colors.background,
    },
    settings: {
        minWidth: "95%",
        maxWidth: "95%",
        margin: 10,
        paddingBottom: 20,
    },
})
