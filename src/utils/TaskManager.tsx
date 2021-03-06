import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { LocationGeofencingEventType, LocationRegion } from 'expo-location';
import { QuestTracker } from '../types/quest';
import {
  addTrackerExperience,
  addTrackerWithUpdate,
  removeTrackerWithUpdate,
  setLiveUpdate,
  setTrackerObjectiveAndTrackerNode
} from '../redux/quests/questsSlice';
import { store } from '../redux/store';
import { getData, storeData } from './AsyncStore';
import { playEventChoiceRequest } from './requestHandler';
import { addExperience } from '../redux/authentication/authenticationSlice';
import { setLocation } from '../redux/location/locationSlice';
import _ from "lodash";

export const GeofencingTask = 'LocationModuleUpdates';
export const LocationNotifTitle = 'Reached location';
export const GeofenceNotifType = 'GeofenceNotification';
export const LocalUpdatedTrackerIds = 'LocalUpdatedTrackerIds';
export const SingleGeoFenceLocationRadius = 30;

export const BackgroundLocationTask = 'BackgroundLocationTask';

TaskManager.defineTask(BackgroundLocationTask, (task) => {
  if(task.error) {
    console.log('BackgroundLocation error: ' + task.error.message);
  }
  if(task.data) {
    // @ts-ignore
    store.dispatch(setLocation(task.data.locations[0]))
  }
  // @ts-ignore
  console.log('Received new locations', task.data.locations);
});

TaskManager.defineTask(GeofencingTask, (task) => {
  console.log(JSON.stringify(task))
  if(task.error) {
    console.log('LocationModuleUpdates error: ' + task.error.message);
  }
  if(task.data) {
    // @ts-ignore
    if(store.getState().quests.trackerWithUpdates.includes(task.data.region.identifier)) return;
    // @ts-ignore
    if(task.data.eventType === LocationGeofencingEventType.Enter) {
      // @ts-ignore
      console.log('reached location ' + task.data.region.identifier);
      // @ts-ignore
      updateQuest(task.data.region.identifier, 0);
      // @ts-ignore
      addUpdatedQuest(task.data.region.identifier);
      // @ts-ignore
      updateGeofencingTask(task.data.region.identifier);
    }
  }
})

export async function registerGeofencingTask(acceptedQuests: QuestTracker[]) {
  {
    let {status} = await Location.getBackgroundPermissionsAsync();
    if (status !== 'granted') {
      return console.log('Permission to access background location was denied');
    }
  }
  let locations: LocationRegion[] = []
  if(acceptedQuests.length === 0) return;
  acceptedQuests.forEach((tracker) => {
    if(tracker.trackerNode.module.type === 'Location') {
      locations.push({
        identifier: tracker.trackerId,
        latitude: tracker.trackerNode.module.location.latitude,
        longitude: tracker.trackerNode.module.location.longitude,
        radius: SingleGeoFenceLocationRadius,
        notifyOnEnter: true,
        notifyOnExit: false,
      })
    }
  })

  if(locations.length === 0) {
    return;
  }
  Location.startGeofencingAsync(GeofencingTask, locations).then(() => console.log('geofencing task registered' + JSON.stringify(locations)), () => console.log('Can\'t start geofencing'))
}

export function updateGeofencingTask(regionIdentifier: string) {
  TaskManager.getTaskOptionsAsync(GeofencingTask)
    // @ts-ignore
    .then((options) => {
      if(options) {
        // @ts-ignore
        return options.regions;
      } else {
        return [];
      }
    })
    .then((regions: LocationRegion[]) => {
      const newRegions = regions.filter((region) => region.identifier !== regionIdentifier)
      if(newRegions.length === 0) {
        Location.stopGeofencingAsync(GeofencingTask).then(() => console.log('Stopped geofencing'));
        return;
      }
      Location.startGeofencingAsync(GeofencingTask, newRegions).then(() => console.log('geofencing task updated' + JSON.stringify(newRegions)))
    })
    .catch(() => {})
}

export function addGeofencingRegion(region: LocationRegion) {
  TaskManager.getTaskOptionsAsync(GeofencingTask)
    // @ts-ignore
    .then((options) => {
      if(options) {
        // @ts-ignore
        return options.regions
      } else {
        return []
      }
    })
    .then((regions: LocationRegion[]) => {
      regions.push(region)
      Location.startGeofencingAsync(GeofencingTask, regions).then(() => console.log('geofencing task updated, added ' + JSON.stringify(region)))
    })
}

export function updateQuest(trackerId: string, choice = 0) {
  const moduleId = store.getState().quests.acceptedQuests.find(tracker => tracker.trackerId === trackerId)!.trackerNode.module.id;
  playEventChoiceRequest(trackerId, choice, moduleId)
    .then(res => res.json())
    .then(res => res.responseEventCollection)
    .then(res => {
      res.responseEvents.forEach(
        (responseEvent: any) => {
          switch (responseEvent.type) {
            case 'ModuleFinish':
              const newTrackerNode = {module: responseEvent.module, memento: null, creationTime: (new Date()).toString()}
              store.dispatch(setTrackerObjectiveAndTrackerNode({
                trackerId: trackerId,
                trackerNode: {...newTrackerNode},
                objective: newTrackerNode.module.objective
              }));
              store.dispatch(setLiveUpdate(true))
              if(responseEvent.module.type === 'Location') {
                const newRegion = {
                  identifier: trackerId,
                  latitude: responseEvent.module.location.latitude,
                  longitude: responseEvent.module.location.longitude,
                  radius: SingleGeoFenceLocationRadius,
                  notifyOnEnter: true,
                  notifyOnExit: false,
                };
                addGeofencingRegion(newRegion);
              }
              const newQuestPath = _.cloneDeep(store.getState().quests.pinnedQuestPath);
              if(trackerId === store.getState().quests.pinnedQuest?.trackerId && newQuestPath) {
                newQuestPath.trackerNodes[newQuestPath.trackerNodes.length-1].memento = res.memento
                newQuestPath.trackerNodes.push(newTrackerNode)
                newQuestPath.quest.tracker.trackerNode = {...newTrackerNode, creationTime: newTrackerNode.creationTime.toString()}
              }
              break;
            case 'Experience':
              console.log('Got XP: +' + responseEvent.experience);
              store.dispatch(addExperience(responseEvent.experience));
              store.dispatch(addTrackerExperience({ trackerId: trackerId, experience: responseEvent.experience }));
              scheduleGeofenceNotification(responseEvent.experience);
              break;
            case 'QuestFinish':
              break;
          }
        }
      )
    })
}

export function scheduleGeofenceNotification(experience: number) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: LocationNotifTitle,
      body: `You received ${experience}XP! Check out the next objective`,
      data: {
        type: GeofenceNotifType,
      }
    },
    trigger: {
      seconds: 1,
    },
  }).then(() => console.log('location notification scheduled'));
}

export function addUpdatedQuest(trackerId: string) {
  store.dispatch(addTrackerWithUpdate(trackerId));
  getData(LocalUpdatedTrackerIds).then((res) => {
    if(res) {
      const data = JSON.parse(res);
      console.log(JSON.stringify(data));
      data.push(trackerId);
      storeData(LocalUpdatedTrackerIds, JSON.stringify(data)).then(() => {})
    } else {
      storeData(LocalUpdatedTrackerIds, JSON.stringify([trackerId])).then(() => {})
    }
  })
  console.log('Added new unread tracker: ' + trackerId);
}

export function removeUpdatedQuest(trackerId: string) {
  store.dispatch(removeTrackerWithUpdate(trackerId));
  getData(LocalUpdatedTrackerIds).then((res) => {
    if(res) {
      const data = JSON.parse(res);
      const newData = data.filter((id: string) => id !== trackerId);
      storeData(LocalUpdatedTrackerIds, JSON.stringify(newData)).then(() => {})
    }
  })
  console.log('Removed unread tracker: ' + trackerId);
}
