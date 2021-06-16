import { store } from "../redux/store"

import * as Location from "expo-location";
import { setLocation } from "../redux/location/locationSlice";

export async function getLocation() {

    const location = store.getState().location.location;

    if (location === undefined) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return Promise.reject(new Error("Permission to access location was denied"))
        }

        let newLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
        store.dispatch(setLocation(newLocation));
    }

}