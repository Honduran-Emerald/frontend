import React from 'react';
import {View, Text, StyleSheet, ScrollView} from "react-native";
import {Colors} from "../styles";

export default interface scrollProps {
    header: string
    type: string
}

export const ScrollMenu = (props:scrollProps) => {
    return (
        <View>
            <Text style={styles.header}>
                {props.header}
            </Text>
            <ScrollView horizontal>
                <Text>
                    1 quest
                </Text>
                <Text>
                    auch 1 quest
                </Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontWeight: "bold",
    },
});