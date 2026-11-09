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

Request a key at https://opendata.aemet.es/. Recommended: put `AEMET_API_KEY=your-key` in the ignored `.env.local` and leave `src/resources/services/keys/config.js` empty (`export default { apiKey: "" }`). Remove any `REACT_APP_AEMET_API_KEY` value too, then restart/rebuild. `AEMET_API_KEY` is read only by the server and is never embedded in the React bundle.

Existing `config.js` keys and `REACT_APP_AEMET_API_KEY` remain supported for compatibility; these legacy keys are still public in browser builds. The server key takes priority over browser-supplied keys. npm hooks create an empty config only if it does not exist and never overwrite an existing file. No credentials are needed for automated tests.

```sh
npm test -- --watchAll=false --runInBand
npm run test:proxy
CI=true npm run build
```

`npm start` mounts the shared weather backend at `/aemet` through `src/setupProxy.js`; no additional process is needed for development. Restart it after updating server code.

For a single-process production deployment:

```sh
npm run build
npm run serve
```

`npm run serve` requires Node.js 22.9+ and loads `.env.local` if present. It serves both `build/` and the same weather backend (default `127.0.0.1:3000`, configurable through `HOST`/`PORT`). In hosting environments, inject `AEMET_API_KEY` as a server secret. A static-only host such as GitHub Pages cannot run this backend. Alternatively mount one `createAemetProxy()` instance at `/aemet` in Express.

## Shared cache and request protection

- `/aemet/map?codes=28079,44001` returns up to 20 municipalities in one browser request, including per-municipality errors and freshness. All map scopes and the detail page reuse the same product cache.
- `/aemet/product?path=prediccion/especifica/municipio/diaria/28079` returns the final forecast directly. The server performs AEMET's two-stage download; raw proxy routes are closed to prevent bypassing the queue.
- Fresh products are reused for **20 minutes**. Expired products are served immediately while one background refresh runs. Valid old products are retained for at most **24 hours**, labelled as stale with their original fetch/issue times. Date selectors still exclude past forecast days/hours.
- Concurrent requests for the same product share one download. A **single global queue spaces every upstream HTTP call by 1.6 seconds**, including metadata and data downloads. Browser refresh cannot bypass it or invalidate the shared cache.
- HTTP or envelope `429` responses pause the entire queue for at least 60 seconds and respect longer `Retry-After` values. Failed products have a 60-second retry cooldown. No automatic retry storm; future requests/polls retry after the cooldown.
- Memory is bounded to 256 cached products, 256 failure records and 64 pending products. New work beyond the queue limit returns a controlled error. A cold nationwide map takes roughly a minute with a responsive upstream; subsequent visitors reuse it. The browser polls once a minute, without overlapping its own polls; this does not force an AEMET refresh.
- Refresh is demand-driven: unused locations generate no background traffic. The cache is in memory and resets on restart. **Run one backend process** for this deployment; multiple replicas would need a shared cache and distributed queue (e.g. Redis) to retain a global limit. Other applications using the same API key also consume its quota.

CI runs unit, HTTP/backend and production-build checks. No live API key is used by tests.

## Data and interpretation

- Official OpenData municipal hourly and daily endpoints, following the two-stage metadata → `datos` response. The initial request sends the `api_key` header declared in the OpenAPI security scheme; the download request does not forward the key. `estado: 200` indicates success (as documented in the official FAQ). Regional text is fetched only after selecting a community.
- The hourly forecast is a prediction, not an observation from a weather station. Its first displayed time is the current municipality hour or the next available hour, with an explicit date and time. Past hours are excluded.
- `Europe/Madrid` and `Atlantic/Canary` determine local dates/hours independently of the browser's timezone, including daylight saving changes.
- Hourly values are joined by `periodo`, not array index. Wind and gust entries are separate. Missing values show `—`; zero and trace precipitation (`Ip`) are retained.
- Today's minimum/maximum come from the daily product, not from the remaining hourly temperatures. Daily intervals and precipitation probabilities are shown separately in their original UTC periods; overlapping probabilities are never averaged or added.
- AEMET's public help pages differ on whether hourly accumulations describe the previous or following hour. The UI therefore labels them as hourly precipitation without asserting an interval direction. Confirm this with AEMET before adding interval arrows.
- Each product displays its own issue timestamp. The browser additionally caches successful detail products for 10 minutes (stale responses for 30 seconds). The active detail refreshes every 10 minutes; its refresh button clears only the browser cache. Hourly and daily failures remain independent.
- The home map uses official municipal daily products for today, tomorrow and the following day. Symbols describe the widest available sky interval (containing the current UTC hour for today); tooltips show that interval and the issue time. Temperatures belong to the named municipalities, not regional averages. Missing forecasts remain blank. A national sample, provincial capitals at community level and up to eight municipalities at province level keep requests bounded. Every municipality remains selectable.
- Community/province boundaries are simplified bundled Click That Hood / CartoDB geometries (attribution and MIT license in `public/maps/NOTICE.txt`). Municipal boundaries are loaded per province from the IGN-derived ArcGIS service and cached for the session. These display boundaries are not cadastral data and may lag administrative changes. Search/list navigation remains available if the geographic service fails. The detail location map retains OpenStreetMap attribution.
- Regional bulletins are general forecasts, not official warnings. The regional endpoint can return the last issued bulletin when today’s product is not available; check its embedded date. `/alerts` displays the national official warning dashboard described below; regional text bulletins are not used to assign warning levels. No invented alert levels or hard-coded weather readings are displayed.
- Geolocation is requested only on user action. Ambiguous/unsupported reverse-geocoding results leave manual search available. Existing favourites and recent-search storage formats are retained.

Sources: [OpenAPI specification](https://opendata.aemet.es/AEMET_OpenData_specification.json), [official FAQ](https://opendata.aemet.es/centrodedescargas/faqs), [OpenData API](https://opendata.aemet.es/dist/), [municipality forecast interpretation](https://www.aemet.es/es/eltiempo/prediccion/municipios/), [detailed help](https://www.aemet.es/es/eltiempo/prediccion/municipios/horas/tabla/gandia-id46131/ayuda).

## Structure

- `server`: shared cache, global upstream queue, restricted backend endpoints and production HTTP host.
- `src/resources/services/APIs`: validated AEMET requests, bounded cache, timeouts, geographic services.
- `src/hooks`: forecast loading lifecycle and reactive favourites.
- `src/features/forecast`: pure data selectors, shared forecast presentation, search, geolocation and location map.
- `src/features/weather-map`: geographic navigation, daily weather markers, map search and responsive home presentation.
- `src/pages`: routing and composition. Home and detail share the same forecast code.

Tests cover request failures, malformed responses, concurrent/cache behaviour, timezone/date boundaries, missing values, stale asynchronous responses, partial forecasts, favourites and search. Live AEMET access requires a valid key and network/CORS availability; synthetic tests do not establish live API availability. The bundled municipality catalogue may need periodic updates from INE/AEMET.

Create React App remains the build system in this refactor; migrating it is a separate tooling change. The nationwide map uses documented OpenData municipal forecasts rather than the former internal website overlay. Legacy per-variable chart tabs are replaced by hourly values and daily-period tables, with an hourly temperature chart.

## National rain and flood watch

`/alerts` is now a nationwide warning dashboard rather than a regional text-bulletin selector. It lists current and upcoming official rain, thunderstorm, flood (when present in the source) and coastal warnings, associated municipalities, severity, certainty, issue/validity times and source links. It does not predict flood extent, declare a town safe, or infer emergency status from reservoir percentages.

The public Meteoalarm Spain Atom snapshot (`https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain`) supplies AEMET warnings without using the application's AEMET API quota. `/aemet/watch` uses one shared request/cache, refreshed on demand after three minutes. Open dashboards poll once per minute. Withdrawn records disappear when the snapshot is replaced; expired warnings are filtered on every read. Test/exercise/cancellation messages are not active warnings. Malformed responses and failed refreshes produce explicit stale/unavailable states, with a one-minute retry cooldown and a maximum 30-minute cached-snapshot lifetime. Older source timestamps are also marked stale. Browser loss of connectivity never becomes a green/no-risk state.

Municipal associations use the official August 2017 AEMET municipality-zone PDF, still linked from AEMET's warning help page when retrieved on 2026-11-09. Exact normalized zone-name matches are used; no fuzzy, coastal or unknown-zone municipal inference is made. The reference maps 8,124 of the app's 8,131 municipalities; seven missing associations are named in the interface. This is historical reference coverage, not a guarantee that every current boundary/zone assignment is unchanged. Unknown zones remain visible in the area list. Display boundaries are the AEMET 2018 distribution, simplified and reprojected. Attribution and source dates are in `public/maps/NOTICE.txt` and in the dashboard.

The optional SNCZI river-flood T=100 layer uses the official WMS at `https://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones`, layer `NZ.Flood.FluvialT100`, visible after zooming in. It is a mapped scenario, not a live flood observation or forecast. Missing mapping is not evidence of safety. WMS tile errors are visible. Neither cartography nor municipal warning association establishes which buildings or individual residents will be affected.

**Coverage limits:** nationwide river flows, reservoir releases and flood-routing models are not integrated. The interface states this and links to the official hydrological systems. Monitoring runs while the dashboard is open; there are no background/push emergency notifications. It complements official information and does not replace emergency communications. Source warnings: AEMET / Meteoalarm (EUMETNET), CC BY 4.0. Hydrological-source integration and validated basin-specific modelling are separate outstanding work before claiming nationwide predictive flood surveillance.
