# 🌦️ Weathia

**Weathia** is a premium, high-performance weather forecasting website built with **Next.js** and **TypeScript**. It goes beyond basic weather reporting by integrating the **Google Maps API** for precision location searching and the **OpenWeather One Call API** for comprehensive meteorological data, all wrapped in a visually immersive and type-safe interface.

---

## 🚀 Live Demo

**Check out the live app here:** 👉 [**https://weathia-bay.vercel.app**]

---

## 📸 Preview

<div align="center">
  <img src="https://i.postimg.cc/nhxqDrqy/weathia-preview.png" alt="Weathia Main Screenshot" width="800px" style="border-radius: 10px; border: 1px solid #ddd;">
</div>

---

## 🌟 Key Features

### 1. Smart Location Intelligence (Google Maps API) 🔎
Unlike standard text searches, Weathia utilizes the **Google Maps JavaScript API**:
* **Places Autocomplete**: Offers real-time, accurate global city suggestions as you type.
* **Geocoding**: Converts search queries into precise coordinates (Latitude/Longitude) to fetch the exact weather for any micro-location.

### 2. Comprehensive Weather Data (OpenWeather API) 🌐
Powered by the **OpenWeather One Call API**, Weathia provides professional-grade data:
* **Real-time Conditions**: Temperature, "Feels Like," Humidity, UV Index, and Visibility.
* **Detailed Hourly Forecast**: A 24-hour breakdown of temperature trends and weather conditions.
* **7-Day Outlook**: Long-range planning with high/low temperatures and precipitation probabilities.

### 3. Global Timezone Synchronization 🌍
One of Weathia's standout technical features is its **Local Time Correction**. The app automatically calculates the target city's local time using `timezone_offset` data. Whether you are in Melbourne searching for London or Beijing, the app displays the *actual* local time of the destination, not your browser's current time.

### 4. Immersive Dynamic Visuals 🌄
* **Adaptive Backgrounds**: The UI background transforms based on weather status (Clear, Clouds, Rain, Snow) and the local **Day/Night cycle** (calculated via Sunrise/Sunset data).
* **Responsive Design**: Fully optimized for a mobile-first, seamless experience across all devices.

---

## 🛠️ Skills & Technologies Used

* **Framework**: [Next.js](https://nextjs.org/) (React 18)
* **Language**: **TypeScript** (Strongly typed components and API interfaces)
* **Styling**: Tailwind CSS / CSS3
* **APIs**: 
    * **OpenWeather API**: Core weather engine.
    * **Google Maps API**: Places & Geocoding services.
* **State Management**: React Hooks (`useState`, `useEffect`)

---

## 🚀 How to Run the Project

To get started with a local development environment:

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/your-username/weathia.git](https://github.com/your-username/weathia.git)
    cd weathia
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
3. **Get your API Keys:**

To run this app, you need to obtain your own API keys from the following services:

* **OpenWeather API**:
    * Create an account and get your key at: [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)
    * *Note: Use the "One Call API 3.0" for full data features.*

* **Google Maps Platform**:
    * Enable the "Places API" and "Maps JavaScript API" at: [https://console.cloud.google.com/google/maps-apis/credentials](https://console.cloud.google.com/google/maps-apis/credentials)
    * *Note: Ensure you enable billing on your Google Cloud project (there is a generous free tier).*

4.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add your keys as follows:

    
```env
    NEXT_PUBLIC_WEATHER_API_KEY="YOUR_ACTUAL_OPENWEATHER_KEY"
    NEXT_PUBLIC_GOOGLE_API_KEY="YOUR_ACTUAL_GOOGLE_MAPS_KEY"
    ```

5.  **Run the app:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🤝 Contributing

We welcome contributions from the developer community!
1.  ⭐ **Star** the repository to show support.
2.  📝 Open an **Issue** to discuss bugs or feature requests.
3.  🍴 **Fork** and Submit a **Pull Request**.

---

## ✨ Acknowledgments

* Huge thanks to **OpenWeatherMap** for the robust data API.
* **Google Cloud Platform** for the seamless location services.
* The open-source community for the inspiration and tools.

---
© 2026 Weathia Project. Created with ❤️ by Rita Zhao.