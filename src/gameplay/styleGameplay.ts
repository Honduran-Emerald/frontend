import { StyleSheet } from "react-native";
import { Colors, Containers } from "../styles";

export const styleGameplay = StyleSheet.create({
  bubble: {
    width: '70%',
    backgroundColor: Colors.primary,
    ...Containers.rounded,
    padding: 20,
    marginVertical: 10,
    color: '#fff',
  },
  right: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 3
  },
  left: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 3
  }
})