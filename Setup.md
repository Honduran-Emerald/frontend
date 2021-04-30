# Setting your computer up for development

This section describes how to setup your computer to run a development server for React-native

- [Download NodeJS](https://nodejs.org/en/) from the official website. (Use the current LTS version, not the latest version)
- clone this repository, open a command prompt inside the cloned repository and type `npm i` to install all necessary dependencies
- Use `npm run android` inside a command prompt inside the cloned repository to run the development server for android or `npm start` to choose the platform you want to view the app from afterwards
- Scan the QR-code on the website with the [Expo Go App](https://play.google.com/store/apps/details?id=host.exp.exponent) or connect an android device or create an emulator following [these instructions](https://docs.expo.io/workflow/android-studio-emulator)
- Make sure you have [USB Debugging enabled](https://developer.android.com/studio/run/device.html#developer-device-options) on your android device when connecting it to your computer.
- Expo also notes the following: If you are using Genymotion go to Settings -> ADB, select "Use custom Android SDK tools", and point it at your Android SDK directory

To stop the development server hit Ctrl+C to terminate the process in your command prompt

# Documentation

- Expo Documentation: [Website](https://docs.expo.io/)
- React Native Documentation: [Website](https://reactnative.dev/docs/getting-started)