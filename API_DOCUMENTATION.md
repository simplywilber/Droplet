# Droplet - API Documentation

This document outlines the application programming interfaces (APIs) utilized and exposed within the Droplet frontend application. It covers both the external REST API consumption and the internal Firebase abstraction layer.

---

## 1. External REST APIs (via Vite Proxy)

The application consumes the ZenQuotes API. To bypass CORS restrictions during development and in production, requests are routed through a local proxy defined in `vite.config.js`.

### 1.1. Quote of the Day
Retrieves the daily curated quote.

*   **Endpoint:** `GET /api/today`
*   **Target:** `https://zenquotes.io/api/today`
*   **Response Format:** JSON Array containing a single quote object.
*   **Example Response:**
    ```json
    [
      {
        "q": "The best way to predict your future is to create it.",
        "a": "Abraham Lincoln",
        "h": "<blockquote>&ldquo;The best way to predict your future is to create it.&rdquo; &mdash; <footer>Abraham Lincoln</footer></blockquote>"
      }
    ]
    ```

### 1.2. Random Quotes Batch
Retrieves a batch of 50 random quotes. Used for the discovery/shuffle feature.

*   **Endpoint:** `GET /api/quotes`
*   **Target:** `https://zenquotes.io/api/quotes`
*   **Response Format:** JSON Array of quote objects.
*   **Example Response:**
    ```json
    [
      {
        "q": "Act as if what you do makes a difference. It does.",
        "a": "William James",
        "h": "..."
      },
      ... (49 more objects)
    ]
    ```

---

## 2. Internal Firebase API (`src/services/firestore.js`)

This module provides a promised-based abstraction layer over the Firebase Firestore SDK, handling all CRUD operations for the user's saved data.

### 2.1. `saveQuote(userId, quote)`
Saves a new quote to the user's personal collection.

*   **Parameters:**
    *   `userId` *(string)*: The Firebase Authentication UID of the current user.
    *   `quote` *(Object)*: The quote object to save. Must contain `q` (or `text`) and `a` (or `author`) properties.
*   **Returns:** `Promise<void>`
*   **Firestore Schema Created:**
    ```javascript
    {
      text: "Quote text",
      author: "Quote author",
      notes: "",            // Empty string by default
      savedAt: 1678886400,  // Unix timestamp
      listId: "Favorites"   // Legacy compatibility field
    }
    ```

### 2.2. `getSavedQuotes(userId)`
Retrieves all quotes saved by a specific user, sorted chronologically (newest first).

*   **Parameters:**
    *   `userId` *(string)*: The Firebase Authentication UID of the current user.
*   **Returns:** `Promise<Array<Object>>` - An array of saved quote objects. Each object is augmented with its Firestore document `id`.

### 2.3. `updateQuoteNote(userId, quoteId, note)`
Updates the personal notes attached to a previously saved quote.

*   **Parameters:**
    *   `userId` *(string)*: The Firebase Authentication UID.
    *   `quoteId` *(string)*: The unique Firestore document ID of the saved quote.
    *   `note` *(string)*: The new text content for the note.
*   **Returns:** `Promise<void>`

### 2.4. `removeSavedQuote(userId, quoteId)`
Permanently deletes a quote from the user's saved collection.

*   **Parameters:**
    *   `userId` *(string)*: The Firebase Authentication UID.
    *   `quoteId` *(string)*: The unique Firestore document ID of the quote to delete.
*   **Returns:** `Promise<void>`

---

## 3. Internal React Context API (`src/context/AuthContext.jsx`)

Provides global access to the authentication state across the component tree without prop drilling.

### 3.1. `useAuth()` Hook
A custom React Hook to access the current authentication context.

*   **Returns:** `Object`
    *   `user` *(FirebaseUser | null)*: The currently logged-in Firebase User object. Returns `null` if the user is signed out.
    *   `loading` *(boolean)*: Indicates whether the initial authentication state is still being resolved by Firebase. True during the initial page load, false once a definitive state (logged in or logged out) is established.

## 4. External Weather API (OpenWeatherMap)
The application consumes the OpenWeatherMap API to provide current weather information based on user inputted city/state or geolocation coordinates. Requests are routed through the Vite proxy during development.

### 4.1 Current Weather by City and State

Retrieves the current weather for a specified city and U.S. state.
Endpoint: GET /api/weather?city={city}&state={state}

Target: https://api.openweathermap.org/data/2.5/weather?q={city},{state},US&units=imperial&appid={API_KEY}

Parameters:
city (string, required): Name of the city.
state (string, required): Two-letter U.S. state code (e.g., WA, NY).

Response Format: JSON object containing weather data.

Example Response:
```json
{
  "coord": { "lon": -122.33, "lat": 47.61 },
  "weather": [
    { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" }
  ],
  "main": {
    "temp": 55.4,
    "feels_like": 53.1,
    "temp_min": 54,
    "temp_max": 57,
    "pressure": 1012,
    "humidity": 87
  },
  "wind": { "speed": 5.2, "deg": 240 },
  "name": "Seattle",
  "sys": { "country": "US" }
}
```
Note: Returns 404 with an error message if the city/state combination is invalid.

### 4.2 Current Weather by Coordinates
Retrieves the current weather using latitude and longitude (geolocation).

Endpoint: GET /api/weather?lat={lat}&lon={lon}
Target: https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid={API_KEY}

Parameters:
lat (number, required): Latitude coordinate.
lon (number, required): Longitude coordinate.

Response Format: JSON object containing weather data (same as above).

Example Response: Same as above.

Note: Returns an error if geolocation coordinates are invalid or unavailable.

### 4.3 Special Handling
Umbrella Icon: If the weather.main property is "Rain" or "Thunderstorm", the frontend displays a custom umbrella image instead of the default weather icon.

Background Gradient: Each main weather condition maps to a predefined gradient for the homepage:

Clear → linear-gradient(to bottom, #56CCF2, #2F80ED)

Clouds → linear-gradient(to bottom, #bdc3c7, #2c3e50)

Rain → linear-gradient(to bottom, #4b79a1, #283e51)

Thunderstorm → linear-gradient(to bottom, #2c3e50, #000000)

Snow → linear-gradient(to bottom, #83a4d4, #b6fbff)

Mist → linear-gradient(to bottom, #757f9a, #d7dde8)

Haze → linear-gradient(to bottom, #f0f2f0, #000c40)