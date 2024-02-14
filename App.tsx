import React from 'react';
import {Button, StatusBar, StyleSheet, View} from 'react-native';
import {PERMISSIONS, request, requestMultiple} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {watchPosition} from 'react-native-geolocation-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';

const App = () => {
  const requestPermissionsHandlerWithCommunityGeoLocation = async () => {
    try {
      const response2 = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      const response = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      console.log('response for background Location Permission :- ', response);
      console.log(
        'response fo ACCESS_FINE_LOCATION ACCESS_COARSE_LOCATION Permission :- ',
        response2,
      );
      Geolocation.setRNConfiguration({
        authorizationLevel: 'always',
        enableBackgroundLocationUpdates: true,
        locationProvider: 'auto',
        skipPermissionRequests: false,
      });
    } catch (err) {
      console.log('Error in request :- ', err);
    }
  };

  const onLocationPressHandlerWithCommunityGeoLocation = async () => {
    await requestPermissionsHandlerWithCommunityGeoLocation();
    Geolocation.watchPosition(
      response => {
        console.log('Location Updates :- ', response);
      },
      error => {
        console.log('Error in Location Updates :- ', error);
      },
      {
        interval: 10000,
        distanceFilter: 20,
        useSignificantChanges: true,
        enableHighAccuracy: true,
        maximumAge: 30000,
      },
    );
  };

  const requestPermissionHandlerWithGeolocationService = async () => {
    try {
      const response2 = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      const response = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      console.log('response for background Location Permission :- ', response);
      console.log(
        'response fo ACCESS_FINE_LOCATION ACCESS_COARSE_LOCATION Permission :- ',
        response2,
      );
    } catch (err) {
      console.log('Error in request :- ', err);
    }
  };

  const onLocationPressHandlerWithGeoLocationServices = async () => {
    await requestPermissionHandlerWithGeolocationService();
    watchPosition(
      position => {
        console.log('Location Updates :- ', position);
      },
      error => {
        console.log('Error in Location Updates :- ', error);
      },
      {
        enableHighAccuracy: true,
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        showLocationDialog: true,
        showsBackgroundLocationIndicator: true,
        useSignificantChanges: true,
        interval: 10000,
        distanceFilter: 20,
        forceRequestLocation: true,
      },
    );
  };

  const requestPermissionsHandlerWithForegroundService = async () => {
    try {
      const response3 = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      const response2 = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      const response = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      console.log('response3 :- ', response3);
      console.log('response for background Location Permission :- ', response);
      console.log(
        'response fo ACCESS_FINE_LOCATION ACCESS_COARSE_LOCATION Permission :- ',
        response2,
      );
    } catch (err) {
      console.log('Error in request :- ', err);
    }
  };

  const foregroundWatchHandler = () => {
    Geolocation.getCurrentPosition(
      response => {
        console.log('Response from foregroundWatchHandler :- ', response);
      },
      err => {
        console.log('err from foregroundWatchHandler :- ', err);
      },
      {
        distanceFilter: 20,
        useSignificantChanges: true,
        enableHighAccuracy: true,
        maximumAge: 30000,
      },
    );
  };

  const startForegroundServiceHandler = async () => {
    await requestPermissionsHandlerWithForegroundService();
    ReactNativeForegroundService.add_task(() => foregroundWatchHandler(), {
      delay: 10000,
      onSuccess: () => {
        console.log('Service Successfully Run');
      },
      onLoop: true,
      taskId: 'locationTask',
      onError: e => console.log(`Error in Service logging:`, e),
    });
    await ReactNativeForegroundService.start({
      id: 1,
      title: 'Foreground Service',
      message: 'you are online!',
      importance: '2',
      icon: 'ic_launcher_foreground',
    });
  };

  const stopForegroundServiceHandler = async () => {
    await ReactNativeForegroundService.stopAll();
  };

  const iosWatchPositionPermissionHandler = async () => {
    const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    console.log('response of Permissions :- ', response);
    Geolocation.setRNConfiguration({
      authorizationLevel: 'always',
      enableBackgroundLocationUpdates: true,
      locationProvider: 'auto',
      skipPermissionRequests: false,
    });
    await Geolocation.requestAuthorization();

    // RNLocation.configure({
    //   activityType: 'automotiveNavigation',
    //   allowsBackgroundLocationUpdates: true,
    //   desiredAccuracy: {
    //     ios: 'bestForNavigation',
    //   },
    //   pausesLocationUpdatesAutomatically: false,
    //   showsBackgroundLocationIndicator: true,
    //   distanceFilter: 10,
    // });
    // RNLocation.requestPermission({
    //   ios: 'always',
    //   android: {
    //     detail: 'fine',
    //   },
    // });
  };

  const iosWatchPositionHandler = async () => {
    Geolocation.watchPosition(
      response => {
        console.log('Location Updates in ios :- ', response);
      },
      error => {
        console.log('Error in Location Updates ios :- ', error);
      },
      {
        // interval: 10000,
        distanceFilter: 20,
        useSignificantChanges: true,
        enableHighAccuracy: true,
      },
    );

    // RNLocation.subscribeToLocationUpdates(locations => {
    //   console.log('locations in subscribeToLocationUpdates :- ', locations);
    // });
  };

  return (
    <View style={styles.mainView}>
      <StatusBar />
      <Button
        title="Get Updates With Community GeoLocation"
        onPress={onLocationPressHandlerWithCommunityGeoLocation}
      />
      <Button
        title="Get Updates With GeoLocation Service"
        onPress={onLocationPressHandlerWithGeoLocationServices}
      />
      <View style={styles.breakLine} />
      <Button
        title="Start Foreground Service"
        onPress={startForegroundServiceHandler}
      />
      <Button
        title="Stop Foreground Service"
        onPress={stopForegroundServiceHandler}
      />
      <View style={styles.breakLine} />
      <Button
        title="IOS Callback Permission"
        onPress={iosWatchPositionPermissionHandler}
      />
      <Button title="IOS callbacks Service" onPress={iosWatchPositionHandler} />
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
