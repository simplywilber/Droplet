# Droplet

Welcome to **Droplet**, a weather and quotes web application! Droplet lets users view current weather for any U.S. city, get daily quotes, and personalize their experience with dynamic backgrounds.

---

## Roadmap

- [X] Create Authentication page and configure Google Firebase project  
- [X] Configure Firebase secret keys and configs  
- [O] Update Home page and integrate Weather API with:  
  - City + state search  
  - “Use My Location” geolocation  
  - Dynamic backgrounds based on weather  
  - Error handling for invalid input  
- [ ] Update Quotes page and implement CRUD functionality  
- [ ] Update About page and add external links  
- [ ] Deploy Website  

---

## Contribution and Roles

Currently, development is led by **Wil**, with plans to open contributions for:  
- Frontend enhancements  
- API integration  
- Styling and animations  
- Bug fixes and accessibility improvements  

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
- “Use My Location” button to fetch weather via geolocation  
- Dynamic background gradients depending on weather (Clear, Clouds, Rain, Snow, etc.)  
- Error handling to prevent crashes for invalid inputs  
- Fully responsive design for desktop, tablet, and mobile  

---

## Known Limitations and Bugs

- Currently only supports U.S. cities for state-based search  
- Weather backgrounds are gradient-based only; no animated effects yet  
- Quotes CRUD is still under development  

---

## Proposed Fixes / Changes

- Add subtle animations for rain, snow, and clouds  
- Expand geolocation support outside the U.S.  
- Implement a dropdown of popular cities for quick selection  
- Complete Quotes page CRUD functionality  
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

Set your OpenWeather API key
Open Home.jsx
Replace "YOUR_API_KEY" with your OpenWeather API key:

```JS
const API_KEY = "YOUR_API_KEY";
```

Start the local server
```bash
npm run dev
```


