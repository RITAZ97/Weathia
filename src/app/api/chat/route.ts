import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const WEATHIA_SYSTEM_INSTRUCTION = `# Role & Purpose
You are "Weathia AI", an expert weather assistant embedded in the Weathia web app. Your core responsibility is to provide precise, real-time, actionable, and structured insights regarding weather forecasts, meteorological parameters, clothing/activity recommendations, and atmospheric science.

# Dynamic Location & IP Context Handling
- NO Default City Assumptions: NEVER default or assume the user is in Melbourne or any specific city unless explicitly passed via system/API context or requested by the user.
- Dynamic Retrieval: Always rely on the user's live location context provided by the app (via IP geolocation or browser positioning APIs).
- Fallback Rule: If location data is entirely absent and the user asks a location-dependent query, provide a general answer based on meteorology standards and add: "Please enable location access or specify your city so I can provide localized data."

# Core Answer Templates & Mandatory Standards
When answering the three primary user query categories, follow these response structures without omitting key metrics:

1. Weather Forecast / Overview
- Required Metrics: High temperature and low temperature (do not use a single peak value), feels-like range, weather condition overview, precipitation probability, wind speed, and wind direction.
- Completeness: Explicitly highlight sudden intraday weather shifts, such as an evening temperature drop or afternoon rain.

2. Clothing & Activity Recommendations
- Required Metrics: Tailored outfit suggestions accounting for the diurnal high/low temperature range, essential carry-ons such as an umbrella, SPF 50+ sunscreen, or windbreaker, and suitability for specific outdoor activities such as running, drying laundry, or stargazing.
- Completeness: Integrate UV index, wind chill, and humidity alongside temperature.

3. Meteorological Parameter / Data Explanation
- Required Metrics: A plain-language definition of the metric, its current scale or level meaning, its impact on health and daily activities, and actionable precautions.
- Completeness: Provide quantitative reference thresholds, such as what UV above 8 or AQI above 100 means.

# Scope & Guardrails
- In-Scope Topics: Weather forecasts, meteorological metric breakdowns, weather-based clothing and travel tips, and climate science.
- Out-of-Scope Handling: Politely refuse non-weather questions using exactly: "I am Weathia AI, designed specifically for weather and climate insights! Feel free to ask about today's high/low forecast, UV protection, or what to wear."
- Data Integrity: Never invent real-time weather metrics without underlying API payload context.

# Tone & UI Rendering Guidelines
- Language: Always respond in English.
- Scannable & Concise: Keep every answer close to 50 English words and never exceed 65 words. Optimize for mobile and desktop chat components using clean Markdown. Bold key metrics and use short bullet points.
- Clean Output: Do not output raw JSON, code blocks, or debug logs to the user interface.`;

interface LiveLocation {
  latitude: number;
  longitude: number;
}

interface WeatherCondition {
  main: string;
  description: string;
}

interface HourlyWeather {
  dt: number;
  temp: number;
  feels_like: number;
  pop: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
}

interface DailyWeather {
  dt: number;
  temp: { min: number; max: number };
  feels_like: { morn: number; day: number; eve: number; night: number };
  pop: number;
  rain?: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
}

interface OneCallWeather {
  timezone: string;
  timezone_offset: number;
  current: HourlyWeather & {
    humidity: number;
    pressure: number;
    uvi: number;
    visibility: number;
  };
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

interface ReverseGeocodingResult {
  name: string;
  state?: string;
  country: string;
}

interface IpLocationResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
}

const isValidLocation = (location: unknown): location is LiveLocation => {
  if (!location || typeof location !== 'object') return false;

  const { latitude, longitude } = location as Partial<LiveLocation>;
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

const getAutomaticLocation = async (request: Request): Promise<LiveLocation | null> => {
  const latitudeHeader = request.headers.get('x-vercel-ip-latitude');
  const longitudeHeader = request.headers.get('x-vercel-ip-longitude');
  const vercelLocation = {
    latitude: Number(latitudeHeader),
    longitude: Number(longitudeHeader),
  };

  if (latitudeHeader && longitudeHeader && isValidLocation(vercelLocation)) {
    return vercelLocation;
  }

  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const lookupUrl = forwardedIp && forwardedIp !== '::1' && forwardedIp !== '127.0.0.1'
    ? `https://ipwho.is/${encodeURIComponent(forwardedIp)}`
    : 'https://ipwho.is/';

  try {
    const response = await fetch(lookupUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return null;

    const result = await response.json() as IpLocationResult;
    const location = {
      latitude: result.latitude,
      longitude: result.longitude,
    };
    return result.success && isValidLocation(location) ? location : null;
  } catch {
    return null;
  }
};

const getWindDirection = (degrees: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % directions.length];
};

const formatLocalTime = (unixTime: number, timezoneOffset: number) =>
  new Date((unixTime + timezoneOffset) * 1000).toISOString().slice(0, 16).replace('T', ' ');

const getLiveWeatherContext = async ({ latitude, longitude }: LiveLocation) => {
  const apiKey = process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) return null;

  const weatherParams = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    units: 'metric',
    exclude: 'minutely',
    appid: apiKey,
  });
  const locationParams = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    limit: '1',
    appid: apiKey,
  });

  try {
    const [weatherResponse, locationResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/3.0/onecall?${weatherParams}`, { cache: 'no-store' }),
      fetch(`https://api.openweathermap.org/geo/1.0/reverse?${locationParams}`, { cache: 'no-store' }),
    ]);

    if (!weatherResponse.ok) return null;

    const weather = await weatherResponse.json() as OneCallWeather;
    const locations = locationResponse.ok
      ? await locationResponse.json() as ReverseGeocodingResult[]
      : [];
    const resolvedLocation = locations[0];
    const locationName = resolvedLocation
      ? [resolvedLocation.name, resolvedLocation.state, resolvedLocation.country].filter(Boolean).join(', ')
      : `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;

    const hourlySummary = weather.hourly
      .slice(0, 24)
      .filter((_, index) => index % 3 === 0)
      .map((hour) =>
        `${formatLocalTime(hour.dt, weather.timezone_offset)}: ${Math.round(hour.temp)}°C, ` +
        `feels ${Math.round(hour.feels_like)}°C, ${hour.weather[0]?.description || 'unknown'}, ` +
        `${Math.round(hour.pop * 100)}% precipitation, wind ${hour.wind_speed.toFixed(1)} m/s ${getWindDirection(hour.wind_deg)}`
      )
      .join('\n');

    const dailySummary = weather.daily
      .slice(0, 8)
      .map((day) => {
        const feelsLikeValues = Object.values(day.feels_like);
        return (
          `${formatLocalTime(day.dt, weather.timezone_offset).slice(0, 10)}: ` +
          `high ${Math.round(day.temp.max)}°C, low ${Math.round(day.temp.min)}°C, ` +
          `feels ${Math.round(Math.min(...feelsLikeValues))}–${Math.round(Math.max(...feelsLikeValues))}°C, ` +
          `${day.weather[0]?.description || 'unknown'}, ${Math.round(day.pop * 100)}% precipitation` +
          `${typeof day.rain === 'number' ? `, ${day.rain.toFixed(1)} mm rain` : ''}, ` +
          `wind ${day.wind_speed.toFixed(1)} m/s ${getWindDirection(day.wind_deg)}`
        );
      })
      .join('\n');

    return `The app obtained the following IP-derived approximate location and OpenWeather data. Treat the weather values as authoritative, but describe the location as city-level rather than precise.
Location: ${locationName}
Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
Timezone: ${weather.timezone}
Observation time: ${formatLocalTime(weather.current.dt, weather.timezone_offset)} local
Current: ${Math.round(weather.current.temp)}°C; feels like ${Math.round(weather.current.feels_like)}°C; ${weather.current.weather[0]?.description || 'unknown'}; humidity ${weather.current.humidity}%; UV ${weather.current.uvi}; pressure ${weather.current.pressure} hPa; visibility ${(weather.current.visibility / 1000).toFixed(1)} km; wind ${weather.current.wind_speed.toFixed(1)} m/s ${getWindDirection(weather.current.wind_deg)}.

Next 24 hours at 3-hour intervals:
${hourlySummary}

Daily forecast:
${dailySummary}`;
  } catch (error) {
    console.error('Weather context error:', error);
    return null;
  }
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages?.[messages.length - 1]?.content || "";

    if (!lastUserMessage) {
      return new Response("Empty message", { status: 400 });
    }

    const automaticLocation = await getAutomaticLocation(req);
    const weatherContext = automaticLocation
      ? await getLiveWeatherContext(automaticLocation)
      : null;
    const contextualInstruction = weatherContext
      ? `${WEATHIA_SYSTEM_INSTRUCTION}\n\n# Trusted Live App Context\n${weatherContext}`
      : `${WEATHIA_SYSTEM_INSTRUCTION}\n\n# Live App Context\nNo live location or weather payload is available. Follow the location fallback rule.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lastUserMessage,
      config: {
        systemInstruction: contextualInstruction
      }
    });

    const aiReply = response.text || "No response generated.";

    return new Response(aiReply, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error: any) {
    console.error("Gemini error:", error);
    return new Response(error?.message || 'Internal Server Error', { status: 500 });
  }
}
