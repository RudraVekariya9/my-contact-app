import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";

import { fetchWeatherByCoords } from "../../services/weatherApi";

export default function WeatherHome() {
  const [temp, setTemp] = useState(null);
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      setLoading(true);

      // Permission
      let { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        setLoading(false);
        return;
      }

      // Get location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      //  Get city name
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        setCity(address[0].city || address[0].region || "Unknown");
      }

      //  Fetch weather
      const data = await fetchWeatherByCoords(latitude, longitude);

      if (data && data.hours && data.hours.length > 0) {
        const now = new Date();

const current = data.hours.reduce((closest, item) => {
  const itemTime = new Date(item.time);

  return Math.abs(itemTime - now) <
    Math.abs(new Date(closest.time) - now)
    ? item
    : closest;
});

console.log("Selected time:", current.time);

        // 🌡 Temperature
        const temperature = current.airTemperature?.sg;
        if (temperature !== undefined) {
          setTemp(Math.round(temperature));
        }

        //  Condition (based on cloud cover)
        const cloud = current.cloudCover?.sg;

        if (cloud < 30) {
          setCondition("Clear");
        } else if (cloud < 70) {
          setCondition("Partly Cloudy");
        } else {
          setCondition("Cloudy");
        }
      }
    } catch (err) {
      console.log("Weather Error:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Refresh handler
  const handleRefresh = () => {
    loadWeather();
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (temp === null) {
    return <Text style={{ textAlign: "center" }}>No data</Text>;
  }

  const getBackgroundColor = () => {
  switch (condition) {
    case "Clear":
      return "#FFD54F"; // sunny

    case "Partly Cloudy":
      return "#CFD8DC";

    case "Cloudy":
      return "#90A4AE";

    default:
      return "#E3F2FD";
  }
};

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor(), flex: 1 }]}>
      {/*  City */}
      <Text style={styles.city}>{city}</Text>

      {/*  Temperature */}
      <Text style={styles.temp}>{temp}°C</Text>

      {/*  Condition */}
      <Text style={styles.condition}>{condition}</Text>

      {/*  Refresh Button */}
      <TouchableOpacity style={styles.button} onPress={handleRefresh}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    },
  city: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
  },
  condition: {
    fontSize: 20,
    color: "#555",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0b74e5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});