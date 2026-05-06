import axios from "axios";

interface WeatherData {
  current: any;
  daily: any[];
  hourly: any[];
  name?: string;
  sys?: { country: string };
}

interface GeoResponse {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const ONE_CALL_URL = "https://api.openweathermap.org/data/3.0/onecall";
const GEO_URL = "https://api.openweathermap.org/data/2.5";
const GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct";

const weatherApi = {
  getWeatherData: async (city: string): Promise<WeatherData> => {
    try {
      const geoRes = await axios.get<GeoResponse[]>(GEOCODING_URL, {
        params: {
          q: city,
          limit: 1,
          appid: API_KEY
        }
      });

      if (!geoRes.data || geoRes.data.length === 0) {
        throw new Error("Can't find this city");
      }
      
      const { lat, lon, name, country } = geoRes.data[0];

      const response = await axios.get<WeatherData>(ONE_CALL_URL, {
        params: {
          lat,
          lon,
          units: "metric",
          exclude: "minutely",
          appid: API_KEY,
        },
      });

      return {
        ...response.data,
        name: name,
        sys: { country }
      };
    } catch (error: any) {
      console.log("error message:", error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch weather data");
    }
  },

  getMultipleCitiesWeather: async (cities: string[]): Promise<any[]> => {
    try {
      const promises = cities.map((city) =>
        axios.get(`${GEO_URL}/weather`, {
          params: {
            q: city,
            units: "metric",
            appid: API_KEY,
          },
        })
      );
      const responses = await Promise.all(promises);
      return responses.map((res) => res.data);
    } catch (error) {
      throw new Error("Failed to fetch multiple cities weather");
    }
  },
}

export default weatherApi;