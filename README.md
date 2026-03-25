# Droplet

Welcome to **Droplet**, a weather and quotes web application! Droplet lets users view current weather for any U.S. city, get daily quotes, and personalize their experience with dynamic backgrounds.

Visit: https://dropletweatherprediction.netlify.app/

---

## Roadmap

- [X] Create Authentication page and configure Google Firebase project  
- [X] Configure Firebase secret keys and configs  
- [X] Update Home page and integrate Weather API with:  
  - City + state search  
  - “Use My Location” geolocation  
  - Dynamic backgrounds based on weather  
  - Error handling for invalid input  
- [X] Update Quotes page and implement CRUD functionality  
- [X] Update About page and add external links  
- [X] Deploy Website  

---

## Contribution and Roles

- **Wilber:**
Created initial project wireframes and helped with the overall project design

Developed the login/register feature for user authentication with Firebase, including the logout functionality

Integrated Home page weather display with OpenWeather API, including dynamic backgrounds based on current conditions

Added “Use My Location” geolocation feature and umbrella/coat recommendation label

Designed and styled responsive weather card layout with error handling for invalid inputs

- **Christian Velez:**
Developed the Quotes page, including quote saving and note taking features.

Adjusted for Zenquotes' free tier API calls which require caching/storing.

Set up responsive layout at breakpoints for desktop, tablet, and mobile viewports.

General testing and adjusting of site behaviors.

---

## Technologies Used

- **Frontend Framework:** React 19 (via Vite)
- **Routing:** React Router v7
- **Database & Auth:** Firebase (Firestore & Authentication)
- **External APIs:** OpenWeather API, ZenQuotes API
- **Styling:** Vanilla CSS (Flexbox, Responsive Media Queries)

---

## Typography

**Logo Font:**  
Bagel Fat One  
[Google Fonts Link](https://fonts.google.com/specimen/Bagel+Fat+One)  

**Body/Standard Font:**  
M PLUS 1  
[Google Fonts Link](https://fonts.google.com/specimen/M+PLUS+1)  

**Font Hierarchy:**  
- H1: 2.2em – 4.4em  
- H2/H3: 1em – 2em  
- Body Text: 1em  
- Labels: 0.2em  

---

## Color Palette

| Color | Hex |
|-------|-----|
| Primary Background | #CCE1EF |
| Secondary Background | #E8F5FD |
| Accent 1 | #9BC0DA |
| Accent 2 | #689EC2 |
| Primary Text / Logo | #1B5B7E |
| Secondary Text | #092F43 |

**Hover Color:** #CEE4F5  
**Navigation Bar Background:** #9DC9E9  
**Authentication Form H1:** #114A68  

---

## Features

- Dynamic greeting based on time of day (Good Morning / Afternoon / Evening)  
- Weather display for city + state with current temperature, conditions, and icon
- 5-Day forecast outlook with intuitive layout  
- “Use My Location” button to fetch weather via geolocation  
- Dynamic background gradients depending on weather (Clear, Clouds, Rain, Snow, etc.)
- Save, Read, Update, and Delete personalized inspiration quotes via Firestore  
- Error handling to prevent crashes for invalid inputs  
- Fully responsive design for desktop, tablet, and mobile  

---

## API Documentation

For detailed information on how data is fetched and structured in this application, please refer to our [API Documentation](API_DOCUMENTATION.md).

---

## Known Limitations and Bugs

- Currently only supports U.S. cities for state-based search  
- Weather backgrounds are gradient-based only; no animated effects yet  
- Favorites note editor has no save confirmation or draft saving, only constant saving.
- Favorites have no sorting options.

---

## Proposed Fixes / Changes

- Add subtle animations for rain, snow, and clouds  
- Expand geolocation support outside the U.S.  
- Implement a dropdown of popular cities for quick selection  
- Improve accessibility and ARIA labels  

---

## Getting Started

Clone the repository
```bash
git clone https://github.com/simplywilber/Droplet.git
```

Install Dependencies
```bash
npm install
```

Set your Environment Variables
Create a `.env` file in the root directory of the project and add your API keys:

```env
VITE_WEATHER_API_KEY="your_openweather_key"
VITE_FIREBASE_API_KEY="your_firebase_key"
```

Start the local server
```bash
npm run dev
```


