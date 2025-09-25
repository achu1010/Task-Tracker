# TaskTracker

A simple React Native (Expo) learning project to practice:

- Core React Native components (View, Text, ScrollView, TextInput)
- State management with hooks
- AsyncStorage persistence (tasks saved locally)
- Task interactions: add, toggle complete, delete
- Basic UI layout & styling (Flexbox)

## Features
- Add tasks using the input + plus button
- Tap the circle to mark complete / incomplete
- Tap the trash icon to remove a task
- Tasks persist between sessions (AsyncStorage)

## Tech Stack
- Expo SDK 53 (original) / migrating to 54 (WIP)
- React 19
- React Native 0.81.x
- AsyncStorage for local persistence

## Running Locally
```bash
npm install --legacy-peer-deps
npx expo start
```
Scan the QR code with Expo Go.

## Possible Next Improvements
- Filters (All / Active / Completed)
- Edit task inline
- Bulk clear completed
- Move to EAS Build for distributable APK / IPA

## License
Personal learning project.
