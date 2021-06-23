import React, { useEffect, useState } from 'react';
import {Button, StatusBar as StatusBar2, StyleSheet, View} from 'react-native';
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

export default interface settingsProps {
    ownProfile: boolean
}

export const SettingsScreen = (props: settingsProps) => {
    const insets = useSafeAreaInsets();

    const location = useAppSelector(state => state.location.location)
    const user = useAppSelector((state) => state.authentication.user);

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        deleteItemLocally('UserToken').then(() => {}, () => {});
        deleteItemLocally('PinnedQuestTracker').then(() => {}, () => {});
        dispatch(logout())
        dispatch(clearQuestState())
    }

    return(
        <View style={[style.screen, {marginTop: insets.top, marginBottom: insets.bottom}]}>
            <ScrollView contentContainerStyle={style.settings}>
                <Button color={'#1D79AC'} title={'Logout'} onPress={handleLogout}/>
            </ScrollView>
            <StatusBar style="auto"/>
        </View>
    );
}

const style = StyleSheet.create({
    screen: {
        justifyContent: "center",
        flexGrow: 1,
        backgroundColor: Colors.background,
        marginTop: StatusBar2.currentHeight,
    },
    settings: {
        margin: 10,
        paddingBottom: 20,
    },
})