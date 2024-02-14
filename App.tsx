import React, {useRef} from 'react';
import {Button, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {PERMISSIONS, request, requestMultiple} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

const App = () => {
  const watchRef = useRef<number>();

  const requestPermissionsHandler = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version > 32) {
          const response3 = await request(
            PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
          );
          console.log('Permissions :- POST_NOTIFICATIONS :- ', response3);
        }
        const response2 = await requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]);
        const response = await request(
          PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        );
        console.log(
          'Permissions :- ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION ,ACCESS_BACKGROUND_LOCATION:- ',
          response2,
          response,
        );
      } catch (err) {
        console.log('Error in android Permission setup :- ', err);
      }
    } else {
      try {
        await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        Geolocation.requestAuthorization();
      } catch (err) {
        console.log('Error in ios Permission setup :- ', err);
      }
    }

    // configure setup
    Geolocation.setRNConfiguration({
      authorizationLevel: 'always',
      enableBackgroundLocationUpdates: true,
      locationProvider: 'auto',
      skipPermissionRequests: false,
    });
  };

  const startUpdateHandler = async () => {
    if (Platform.OS === 'android') {
      ReactNativeForegroundService.add_task(() => {}, {
        delay: 1000,
        onSuccess: () => {
          // foregroundWatchHandler();
          console.log('Service Successfully Run');
        },
        onLoop: false,
        taskId: 'LocationUpdatesTask',
        onError: e => console.log(`Error in Service logging:`, e),
      });
      await ReactNativeForegroundService.start({
        id: 1,
        title: 'Location Updates...',
        message: 'Getting User Location Updates',
        importance: '2',
        icon: 'ic_launcher_foreground',
      });
    }
    watchRef.current = Geolocation.watchPosition(
      response => {
        console.log('Location Updates in ios :- ', response);
      },
      error => {
        console.log('Error in Location Updates ios :- ', error);
      },
      {
        // interval: 5000,
        distanceFilter: 10,
        // useSignificantChanges: true,
        enableHighAccuracy: true,
        // fastestInterval: 10,
      },
    );
  };

  const stopUpdateHandler = async () => {
    try {
      await ReactNativeForegroundService.stopAll();
      if (watchRef.current !== undefined) {
        Geolocation.clearWatch(watchRef.current);
      }
    } catch (err) {
      console.log('Error in stopUpdateHandler :- ', err);
    }
  };

  return (
    <View style={styles.mainView}>
      <StatusBar />
      <Button title="Request Permission" onPress={requestPermissionsHandler} />
      <Button title="Start Updates" onPress={startUpdateHandler} />
      <Button title="Stop Updates" onPress={stopUpdateHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
  },
  breakLine: {
    marginVertical: 10,
    height: 2,
    width: '100%',
    backgroundColor: 'black',
  },
});

export default App;
