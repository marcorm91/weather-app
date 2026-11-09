# Weather App

Municipality forecasts from AEMET OpenData, built with React. The home page combines municipality search, favourites and a forecast summary. Detail URLs (`/more-info?municipio=28079`) display hourly data, a temperature chart and daily forecasts. Spanish and English interface; source forecast descriptions remain in Spanish.

## Run locally

Requires Node.js 22 and npm.

```sh
npm ci
cp .env.example .env.local
# Set REACT_APP_AEMET_API_KEY in .env.local
npm start
```

Request a key at https://opendata.aemet.es/. The old ignored `src/resources/services/keys/config.js` is no longer imported: move its `apiKey` value into `.env.local`. Restart the development server after changing environment variables. Builds work without a key and show a configuration message when a forecast is requested.

A browser build exposes its environment variables. This setup is suitable for a personal demo; a private production key requires a server-side proxy, authentication/rate limits and server-side caching. Do not commit API keys. No credentials are needed for automated tests.

```sh
npm test -- --watchAll=false --runInBand
CI=true npm run build
```

CI runs these checks on pull requests. Production hosting must serve `index.html` for application routes; configure a rewrite for `/more-info`, `/alerts` and `/contact` (GitHub Pages does not provide SPA rewrites automatically).

## Data and interpretation

- Official OpenData municipal hourly and daily endpoints, following the two-stage metadata → `datos` response. Regional text is fetched only after selecting a community.
- The hourly forecast is a prediction, not an observation from a weather station. Its first displayed time is the current municipality hour or the next available hour, with an explicit date and time. Past hours are excluded.
- `Europe/Madrid` and `Atlantic/Canary` determine local dates/hours independently of the browser's timezone, including daylight saving changes.
- Hourly values are joined by `periodo`, not array index. Wind and gust entries are separate. Missing values show `—`; zero and trace precipitation (`Ip`) are retained.
- Today's minimum/maximum come from the daily product, not from the remaining hourly temperatures. Daily intervals and precipitation probabilities are shown separately in their original UTC periods; overlapping probabilities are never averaged or added.
- AEMET's public help pages differ on whether hourly accumulations describe the previous or following hour. The UI therefore labels them as hourly precipitation without asserting an interval direction. Confirm this with AEMET before adding interval arrows.
- Each product displays its own issue timestamp. Successful products are cached for 10 minutes (up to 100 entries), concurrent requests are shared, and the active forecast refreshes every 10 minutes. Refresh bypasses cache. Failed requests are not cached; hourly and daily failures are independent.
- The former home map used an internal AEMET website endpoint and silently tried later days on errors. It has been replaced by an on-demand geographical municipality map, with OpenStreetMap attribution. Municipal boundaries are queried directly by INE code instead of downloading every municipality.
- Regional bulletins are general forecasts, not official warnings. `/alerts` links to official AEMET warnings and separately offers regional text forecasts. No invented alert levels or hard-coded weather readings are displayed.
- Geolocation is requested only on user action. Ambiguous/unsupported reverse-geocoding results leave manual search available. Existing favourites and recent-search storage formats are retained.

Sources: [OpenData API](https://opendata.aemet.es/dist/), [municipality forecast interpretation](https://www.aemet.es/es/eltiempo/prediccion/municipios/), [detailed help](https://www.aemet.es/es/eltiempo/prediccion/municipios/horas/tabla/gandia-id46131/ayuda).

## Structure

- `src/resources/services/APIs`: validated AEMET requests, bounded cache, timeouts, geographic services.
- `src/hooks`: forecast loading lifecycle and reactive favourites.
- `src/features/forecast`: pure data selectors, shared forecast presentation, search, geolocation and map.
- `src/pages`: routing and composition. Home and detail share the same forecast code.

Tests cover request failures, malformed responses, concurrent/cache behaviour, timezone/date boundaries, missing values, stale asynchronous responses, partial forecasts, favourites and search. Live AEMET access requires a valid key and network/CORS availability; synthetic tests do not establish live API availability. The bundled municipality catalogue may need periodic updates from INE/AEMET.

Create React App remains the build system in this refactor; migrating it is a separate tooling change. The runtime contains no nationwide weather-overlay map or legacy per-variable chart tabs; equivalent hourly values and daily periods are available as tables, with an hourly temperature chart.
