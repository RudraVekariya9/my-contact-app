import axios from "axios";

const API_KEY = "52a4768e-3a40-11f1-beac-0242ac120004-52a476f2-3a40-11f1-beac-0242ac120004";

export const fetchWeatherByCoords = async (lat, lng) => {
  try {
    const res = await axios.get(
      "https://api.stormglass.io/v2/weather/point",
      {
        params: {
          lat,
          lng,
          params: "airTemperature,cloudCover",
        },
        headers: {
          Authorization: API_KEY,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log("Stormglass API Error:", error);
    return null;
  }
};