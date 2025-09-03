# WeatherJS

WeatherJS is a modern weather app built with React, Vite, and TailwindCSS. It lets you check the current weather and get a 5-day forecast for cities around the world.

## Features

* Get weather data for any city worldwide
* View 5-day extended forecasts
* Clean, modern UI built with ShadCN and TailwindCSS
* Toggle between light and dark themes
* Smart search with city name suggestions
* Built for speed and performance using Vite

## Getting Started

### Requirements

* Node.js (v16 or higher)
* npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd WeatherJS
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

* `npm run dev` – Start the development server
* `npm run build` – Create a production build (outputs to `dist/` directory)
* `npm run preview` – Preview the production build locally

## Building for Production

To create a production build:

```bash
npm run build
```

This command:
- Builds the React application using Vite
- Optimizes and minifies the code
- Creates static files in the `dist/` directory
- The `dist/` folder contains all files needed for deployment

## Tech Stack

* React 18
* Vite
* TailwindCSS
* ShadCN/UI
* Radix UI
* Lucide React
* OpenWeatherMap API

## How to Use

* Click on one of the preloaded city cards to instantly load weather data
* Use the search bar to look up any city
* Start typing a city name to get suggestions
* Use the theme toggle in the header to switch between light and dark mode
* Check the daily forecast for the next five days

## Project Structure

```
WeatherJS/
├── app/                         # Next.js App Router
│   ├── api/
│   │   └── weather/             # API routes
│   │       ├── current/
│   │       │   └── route.ts     # Current weather endpoint
│   │       ├── forecast/
│   │       │   └── route.ts     # 5-day forecast endpoint
│   │       ├── coords/
│   │       │   └── route.ts     # Coordinates-based weather
│   │       └── search/
│   │           └── route.ts     # City search endpoint
│   ├── components/
│   │   ├── ui/                  # ShadCN UI components (TypeScript)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── mode-toggle.tsx
│   │   │   └── tabs.tsx
│   │   ├── weather/             # Weather-specific components
│   │   │   ├── CityInfo.tsx
│   │   │   ├── DailyForecast.tsx
│   │   │   ├── HourlyForecast.tsx
│   │   │   └── SearchInput.tsx
│   │   ├── layout/
│   │   │   └── theme-provider.tsx
│   │   ├── HomePage.tsx         # Main weather dashboard
│   │   ├── AboutPage.tsx
│   │   └── ApiPage.tsx
│   ├── lib/
│   │   ├── api.ts               # Client-side API functions
│   │   ├── utils.ts             # General utilities
│   │   └── date.ts              # Date formatting helpers
│   ├── types/
│   │   └── weather.ts           # TypeScript interfaces
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Main page with tab navigation
├── tailwind.config.js           # Tailwind configuration
├── components.json              # ShadCN configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── package.json
```

## Weather API

This app uses OpenWeatherMap to fetch:

* Current weather
* 5-day forecasts
* Geolocation data for search

**Important:** The app comes with a demo API key. To use your own:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the key in `src/lib/weather-api.js`
3. Use environment variables to protect your API key in production

## Styling and Themes

The UI is styled using TailwindCSS and ShadCN/UI components with TypeScript. You can customize the theme colors and layout through:

* `app/globals.css` – CSS custom properties for light/dark theme variables
* `tailwind.config.js` – Tailwind configuration with TypeScript path mappings
* `components.json` – ShadCN component settings and aliases

The theming system uses CSS variables defined in `app/globals.css` with HSL color values for both light and dark modes. All components are built with TypeScript (.tsx files) and use the ShadCN design system.

## Deployment

To build for production:

```bash
npm run build
```

The output will be in the `dist/` folder.

To deploy:

* Upload the `dist/` folder to your host (Netlify, Vercel, etc.)
* Make sure your host is set to serve `index.html` for all routes

## Contributing

1. Fork this repo
2. Create a new branch: `git checkout -b your-feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push the branch: `git push origin your-feature-name`
5. Open a pull request

## License

This project is licensed under the [MIT License](LICENSE)

## Acknowledgments

* Weather data from [OpenWeatherMap](https://openweathermap.org/)
* UI components from [ShadCN](https://ui.shadcn.com/)
* Icons from [Lucide](https://lucide.dev/)
