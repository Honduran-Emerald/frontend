# Frontend

## Setup
### Tool Requirements

- [yarn](https://yarnpkg.com/)
- [expo](https://docs.expo.io/get-started/installation/)

Both `yarn` and `expo` should be available as commands in your terminal of choice.

### Firebase Setup

*Hona* uses [Firebase](https://firebase.google.com/) to provide push notifications. If you don't need push notifications, skip this section. Without push notifications the app state might desync. You will not be notified on incoming chat messages or when reaching a location-bound target. You also won't receive live chat messages. You will still be able to fully interact with all features but some parts might require a full app refresh.

Steps to include push notifications:
- Create a [firebase project](https://console.firebase.google.com/u/0/).
- In the [project console](https://console.firebase.google.com/u/0/), click "Add Firebase to your Android app" and follow the setup steps. As the Android package name, enter "honduran.emerald".
- Download the respective google-services.json file and place it in the top level directory.
- Using the Google Cloud Platform API Credentials console, confirm that the API key is either unrestricted (not recommended), or has access to the "Firebase Cloud Messaging API" and the "Firebase Installations API".

- Copy your Firebase Server Key (at the top of the sidebar, click the gear icon to the right of Project Overview - then click on the Cloud Messaging tab in the Settings pane).
- Run the following command.
> `$ expo push:android:upload --api-key <your-server-key-here>`

### Connecting to backend

Open `GLOBALCONFIG.tsx` in the top-level directory. Change the variable BACKENDIP to the ip-address of your backend.

## Running

### Without building

Expo allows running the app without building it. This strongly reduces app performance but skips the time needed to wait for a build.

Using the Expo Go App, *Hona* can be run without building the app by using 

> `$ expo start`

on the local network or

> `$ expo start --tunnel`

to run remotely. The latter will suffer a large drop in performance.

### With building

Run

> `$ expo build:android -t apk`

to create a build of *Hona*. Depending on the time of day, building can take up to half an hour.