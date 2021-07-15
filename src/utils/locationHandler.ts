import {store} from "../redux/store"

import * as Location from "expo-location";
import {LocationAccuracy} from "expo-location";
import {setLocation} from "../redux/location/locationSlice";
import {BackgroundLocationTask} from "./TaskManager";

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
      {accuracy: LocationAccuracy.Highest, distanceInterval: 5, timeInterval: 5000},
      (location) => store.dispatch(setLocation(location))
    )
}

export async function registerBackgroundLocationTask() {
    {
        let {status} = await Location.getBackgroundPermissionsAsync();
        if (status !== 'granted') {
            return console.log('Permission to access background location was denied');
        }
    }
    Location.startLocationUpdatesAsync(BackgroundLocationTask, {accuracy: LocationAccuracy.Highest, timeInterval: 5000})
      .then(() => console.log('Background location task registered'), (err: any) => console.log(JSON.stringify(err)))
}
