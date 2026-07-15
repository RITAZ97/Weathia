# 🌦️ Weathia

**Weathia** is a premium, high-performance, AI-augmented weather forecasting website built with **Next.js** and **TypeScript**. It goes beyond basic weather reporting by integrating the **Google Maps API** for precision location searching, the **OpenWeather One Call API** for comprehensive meteorological data, and an intelligent **Gemini-powered AI Assistant** for contextual weather insights—all wrapped in a visually immersive and type-safe interface.

---

## 🚀 Live Demo

**Check out the live app here:** 👉 [**https://weathia-bay.vercel.app**]

---

## 📸 Preview

<div align="center">
  <img src="https://i.postimg.cc/6pbych6N/readme1.png" alt="Weathia Main Screenshot" width="800px" style="border-radius: 10px; border: 1px solid #ddd; margin-bottom: 15px;">
  <img src="https://i.postimg.cc/MKWH8LvK/AI-preview.png" alt="Weathia Premium AI Assistant" width="800px" style="border-radius: 10px; border: 1px solid #ddd;">
</div>

---

## 🌟 Key Features

### 🔐 User Authentication & Membership System 👤
Weathia features a fully functional user account ecosystem to manage personalized preferences and access tiers:
* **User Registration & Login**: Secure authentication flow allowing users to create personal accounts, save preferred home locations, and persist application settings.
* **Tiered Membership Structure**: 
  * **Free Account**: Includes real-time forecasting, global timezone synchronization, dynamic visuals, and precision location search.
  * **Premium Account**: Unlocks the advanced AI core and advanced cognitive weather analysis.

### ✨ Premium AI Assistant (Premium Upgrade Required) 🤖
*(Note: The Premium Upgrade simulates a checkout experience for portfolio presentation purposes. No real money or actual credit cards are involved).*
Unlock full-stack cognitive weather insights powered by the **Gemini API** once upgraded:
* **Layering & Gear Guide**: Evaluates real-time feels-like temperature, wind speed, and humidity to recommend the perfect layered outfit and essential gear for going out.
* **Proactive Forecasting (Tomorrow's Peak)**: Instant, one-click analysis of key meteorological shifts, such as tomorrow's maximum temperature trends and whether you will need to pack an umbrella.
* **Wellness & Comfort**: Evaluates current physical comfort levels and environmental conditions to provide actionable health tips.
* **Interactive AI Chat**: Ask specific weather-related questions about any location and get instant, intelligent, and context-aware responses.

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
    * **Gemini API**: Powers the intelligent conversational AI core.
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

* **Google AI Studio (Gemini API)**:
    * Generate your API key at: [https://aistudio.google.com/](https://aistudio.google.com/)
* **OpenWeather API**:
    * Create an account and get your key at: [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)
    * *Note: Use the "One Call API 3.0" for full data features.*
* **Google Maps Platform**:
    * Enable the "Places API" and "Maps JavaScript API" at: [https://console.cloud.google.com/google/maps-apis/credentials](https://console.cloud.google.com/google/maps-apis/credentials)
    * *Note: Ensure you enable billing on your Google Cloud project (there is a generous free tier).*

4.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add your keys as follows:

    ```env
    # Core Meteorological & Maps APIs
    NEXT_PUBLIC_WEATHER_API_KEY="YOUR_ACTUAL_OPENWEATHER_KEY"
    NEXT_PUBLIC_GOOGLE_API_KEY="YOUR_ACTUAL_GOOGLE_MAPS_KEY"

    # AI Integration (Recommended to process via Next.js Route Handlers for security)
    GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
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

* **Google AI Studio** for providing the advanced Gemini language models.
* Huge thanks to **OpenWeatherMap** for the robust data API.
* **Google Cloud Platform** for the seamless location services.
* The open-source community for the inspiration and tools.

---
© 2026 Weathia Project. Created with ❤️ by Rita Zhao.