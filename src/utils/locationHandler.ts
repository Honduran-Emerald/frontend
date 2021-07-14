import {store} from "../redux/store"

import * as Location from "expo-location";
import {LocationAccuracy} from "expo-location";
import {setLocation} from "../redux/location/locationSlice";

export async function getLocation() {

    const location = store.getState().location.location;

    if (location === undefined) {
        {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return Promise.reject(new Error("Permission to access location was denied"))
            }
        }
        {
            let {status} = await Location.requestBackgroundPermissionsAsync();
            if (status !== 'granted') {
                return Promise.reject(new Error("Permission to access background location was denied"))
            }
        }

        let lastLocation = await Location.getLastKnownPositionAsync();
        if (lastLocation) {
            store.dispatch(setLocation((lastLocation)));
        }
        let newLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
        store.dispatch(setLocation(newLocation));
        return newLocation
    }

    return location

}

export async function getLocationSubscription() {

    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        return Promise.reject(new Error("Permission to access location was denied"))
    }

    return Location.watchPositionAsync(
      {accuracy: LocationAccuracy.High, distanceInterval: 5, timeInterval: 10000},
      (location) => store.dispatch(setLocation(location))
    )
}
