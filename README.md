# Weather App

Municipality forecasts from AEMET OpenData, built with React. The home page opens with a TV-style weather map: Spain → autonomous community → province → municipality, with daily weather symbols, minimum/maximum temperatures, a Canary Islands inset, search and favourites. Selecting a municipality opens its forecast summary beside the map. Detail URLs (`/more-info?municipio=28079`) display hourly data, a temperature chart and daily forecasts. Spanish and English interface; source forecast descriptions remain in Spanish.

## Run locally

Requires Node.js 22 and npm.

```sh
npm ci
# Keep your existing src/resources/services/keys/config.js
# Its default export should contain apiKey: "your-key"
npm start
```

Request a key at https://opendata.aemet.es/. The existing ignored `src/resources/services/keys/config.js` remains supported (`export default { apiKey: "your-key" }`) and takes priority. The npm start/build/test hooks create an empty config from `config.example.js` only if it does not exist; they never overwrite an existing file. Alternatively, set `REACT_APP_AEMET_API_KEY` in `.env.local`. Restart the development server after changing configuration. Builds work without a key and show a configuration message when a forecast is requested.

A browser build exposes its environment variables. This setup is suitable for a personal demo; a private production key requires a server-side proxy, authentication/rate limits and server-side caching. Do not commit API keys. No credentials are needed for automated tests.

```sh
npm test -- --watchAll=false --runInBand
npm run test:proxy
CI=true npm run build
```

`npm start` installs a same-origin `/aemet` proxy via `src/setupProxy.js`: both the metadata and temporary data downloads go through the local server, so AEMET does not need to grant browser CORS access. Restart `npm start` after updating this file. The proxy forwards only the known municipal/regional routes and temporary `/opendata/sh/` downloads to the fixed HTTPS AEMET host, without forwarding browser cookies or Origin headers. It does not log API keys.

**Production:** `setupProxy.js` is development-only and is not included in `build/`. Mount `server/aemetProxy.cjs` at `/aemet` in your Node/Express host (`app.use('/aemet', require('./server/aemetProxy.cjs')())`), or provide an equivalent restricted reverse proxy at that same path. A static-only host such as GitHub Pages cannot run this proxy by itself. Browser-stored keys remain public; a private production key should be loaded by the server instead, with access controls/rate limiting.

CI runs these checks on pull requests. Production hosting must serve `index.html` for application routes; configure a rewrite for `/more-info`, `/alerts` and `/contact` (GitHub Pages does not provide SPA rewrites automatically).

## Data and interpretation

- Official OpenData municipal hourly and daily endpoints, following the two-stage metadata → `datos` response. The initial request sends the `api_key` header declared in the OpenAPI security scheme; the download request does not forward the key. `estado: 200` indicates success (as documented in the official FAQ). Regional text is fetched only after selecting a community.
- The hourly forecast is a prediction, not an observation from a weather station. Its first displayed time is the current municipality hour or the next available hour, with an explicit date and time. Past hours are excluded.
- `Europe/Madrid` and `Atlantic/Canary` determine local dates/hours independently of the browser's timezone, including daylight saving changes.
- Hourly values are joined by `periodo`, not array index. Wind and gust entries are separate. Missing values show `—`; zero and trace precipitation (`Ip`) are retained.
- Today's minimum/maximum come from the daily product, not from the remaining hourly temperatures. Daily intervals and precipitation probabilities are shown separately in their original UTC periods; overlapping probabilities are never averaged or added.
- AEMET's public help pages differ on whether hourly accumulations describe the previous or following hour. The UI therefore labels them as hourly precipitation without asserting an interval direction. Confirm this with AEMET before adding interval arrows.
- Each product displays its own issue timestamp. Successful products are cached for 10 minutes (up to 100 entries), concurrent requests are shared, and the active forecast refreshes every 10 minutes. Refresh bypasses cache. Failed requests are not cached; hourly and daily failures are independent.
- The home map uses official municipal daily products for today, tomorrow and the following day. Symbols describe the widest available sky interval (containing the current UTC hour for today); tooltips show that interval and the issue time. Temperatures belong to the named municipalities, not regional averages. Missing forecasts remain blank. A national sample, provincial capitals at community level and up to eight municipalities at province level keep requests bounded. Every municipality remains selectable.
- Two-stage AEMET products start at least three seconds apart across the client, alongside caching and request deduplication. Initial map readings therefore appear progressively; a map can take about a minute to fill on an empty cache.
- Community/province boundaries are simplified bundled Click That Hood / CartoDB geometries (attribution and MIT license in `public/maps/NOTICE.txt`). Municipal boundaries are loaded per province from the IGN-derived ArcGIS service and cached for the session. These display boundaries are not cadastral data and may lag administrative changes. Search/list navigation remains available if the geographic service fails. The detail location map retains OpenStreetMap attribution.
- Regional bulletins are general forecasts, not official warnings. The regional endpoint can return the last issued bulletin when today’s product is not available; check its embedded date. `/alerts` links to official AEMET warnings and separately offers regional text forecasts. No invented alert levels or hard-coded weather readings are displayed.
- Geolocation is requested only on user action. Ambiguous/unsupported reverse-geocoding results leave manual search available. Existing favourites and recent-search storage formats are retained.

Sources: [OpenAPI specification](https://opendata.aemet.es/AEMET_OpenData_specification.json), [official FAQ](https://opendata.aemet.es/centrodedescargas/faqs), [OpenData API](https://opendata.aemet.es/dist/), [municipality forecast interpretation](https://www.aemet.es/es/eltiempo/prediccion/municipios/), [detailed help](https://www.aemet.es/es/eltiempo/prediccion/municipios/horas/tabla/gandia-id46131/ayuda).

## Structure

- `src/resources/services/APIs`: validated AEMET requests, bounded cache, timeouts, geographic services.
- `src/hooks`: forecast loading lifecycle and reactive favourites.
- `src/features/forecast`: pure data selectors, shared forecast presentation, search, geolocation and location map.
- `src/features/weather-map`: geographic navigation, daily weather markers, map search and responsive home presentation.
- `src/pages`: routing and composition. Home and detail share the same forecast code.

Tests cover request failures, malformed responses, concurrent/cache behaviour, timezone/date boundaries, missing values, stale asynchronous responses, partial forecasts, favourites and search. Live AEMET access requires a valid key and network/CORS availability; synthetic tests do not establish live API availability. The bundled municipality catalogue may need periodic updates from INE/AEMET.

Create React App remains the build system in this refactor; migrating it is a separate tooling change. The nationwide map uses documented OpenData municipal forecasts rather than the former internal website overlay. Legacy per-variable chart tabs are replaced by hourly values and daily-period tables, with an hourly temperature chart.
