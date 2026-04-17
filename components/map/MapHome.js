import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";


export default function MapHome() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Permission denied");
      console.log("Permission denied");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    console.log("LOCATION:", loc);

    setLocation(loc.coords);
  })();
}, []);

    

  return (
  <View style={{ flex: 1 }}>
    {location ? (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
        />
      </MapView>
    ) : (
      <Text>Loading map...</Text>
    )}
  </View>
);
}