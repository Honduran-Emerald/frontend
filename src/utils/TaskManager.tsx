import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { LocationGeofencingEventType, LocationRegion } from 'expo-location';
import { QuestTracker } from '../types/quest';

export const GeofencingTask = 'LocationModuleUpdates';
export const LocationNotifTitle = 'Reached location';
export const GeofenceNotifType = 'GeofenceNotification';

TaskManager.defineTask(GeofencingTask, (task) => {
  if(task.error) {
    console.log('LocationModuleUpdates error: ' + task.error.message);
  }
  if(task.data) {
    // @ts-ignore
    if(task.data.eventType === LocationGeofencingEventType.Enter) {
      // @ts-ignore
      console.log('reached location ' + task.data.region.identifier);
      Notifications.scheduleNotificationAsync({
        content: {
          title: LocationNotifTitle,
          body: 'Check out the next objective',
          data: {
            type: GeofenceNotifType,
          }
        },
        trigger: {
          seconds: 5,
        },
      }).then(() => console.log('location notification scheduled'));
      // TODO send fetch, show indicator in questlog (and optionally pinned quest card)

      // @ts-ignore
      updateGeofencingTask(task.data.region);
    }
  }
})

export function registerGeofencingTask(acceptedQuests: QuestTracker[]) {
  let locations: LocationRegion[] = []
  if(acceptedQuests.length === 0) return;
  acceptedQuests.forEach((tracker) => {
    if(tracker.trackerNode.module.type === 'Location') {
      locations.push({
        identifier: tracker.trackerId,
        latitude: tracker.trackerNode.module.locationModel.latitude,
        longitude: tracker.trackerNode.module.locationModel.longitude,
        radius: 20,
        notifyOnEnter: true,
      })
    }
  })
  // TODO remove testing region
  locations.push({
    identifier: 'test',
    latitude: 49.872762,
    longitude: 8.651217,
    radius: 20,
    notifyOnEnter: true,
  })

  if(locations.length === 0) {
    return;
  }
  Location.startGeofencingAsync(GeofencingTask, locations).then(() => console.log('geofencing task registered' + JSON.stringify(locations)))
}

export function updateGeofencingTask(regionReached: LocationRegion) {
  let regions: LocationRegion[] = [];
  TaskManager.getRegisteredTasksAsync().then((tasks) => {
    tasks.forEach((task) => {
      if (task.taskName === GeofencingTask) {
        regions = task.options.regions
      }
    })
  }).then(() => {
    const newRegions = regions.filter((region) => region.identifier !== regionReached.identifier)
    if(newRegions.length === 0) {
      Location.stopGeofencingAsync(GeofencingTask).then(() => console.log('Stopped geofencing'));
      return;
    }
    Location.startGeofencingAsync(GeofencingTask, newRegions).then(() => console.log('geofencing task updated' + JSON.stringify(newRegions)))
  })
}
