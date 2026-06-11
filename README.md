# Rat Hunt

**A real-time social party game built as an installable React and TypeScript PWA, with Firebase-backed multiplayer rooms, presence tracking, and shared client/server game logic.**

<p align="center">
  <a href="https://rat-hunt.web.app/">
    <img src="frontend/resources/icons/logo-192x192.png" alt="Rat Hunt logo" width="160" />
  </a>
</p>

## Links

- **Live app:** [rat-hunt.web.app](https://rat-hunt.web.app/)
- **Gameplay demo:** [Watch on YouTube](https://youtu.be/WxCCqd9LFTQ)
- **Architecture notes:** [Client-server architecture](resources/docs/Client-Server%20Architecture.md)
- **Setup guides:** [Frontend](frontend/README.md) · [Backend](backend/README.md)

## Preview

<a href="https://youtu.be/WxCCqd9LFTQ">
  <img src="resources/readme/thumbnails/youtubeplaybtn.png" alt="Watch the Rat Hunt gameplay demo" width="70%" />
</a>

Players join a shared room, receive a secret word or the hidden rat role, submit clues in turn, vote for the suspected rat, and score points based on the vote and the rat's final guess.

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router |
| UI | styled-components, Framer Motion, Sass |
| Client data | TanStack Query, Firebase SDK |
| Backend | Firebase Cloud Functions, Firebase Admin SDK |
| Persistence | Cloud Firestore, Firebase Realtime Database |
| PWA | vite-plugin-pwa, Workbox, Web App Manifest |
| Quality | strict TypeScript, ESLint, Prettier, Vitest, React Testing Library |
| Deployment | Firebase Hosting and Cloud Functions |

## Key Features

- Host or join private multiplayer rooms with generated five-character room codes.
- Supports 3–20 players, selectable topics, and configurable games of 1–10 rounds.
- Runs the complete clue, vote, rat-guess, scoring, round-summary, and replay flow.
- Synchronizes room and game-state changes in real time through Firestore snapshot listeners.
- Tracks connection state with Realtime Database `onDisconnect` handlers and reconciles it to Firestore through a Cloud Function.
- Allows late arrivals to join an active room as spectators until the next round.
- Shares room codes through the Web Share API, with clipboard fallback where sharing is unavailable.
- Provides an installable PWA experience with light/dark themes, generated icons, and device-specific installation guidance.

## How It Works

1. One player hosts a room and selects a topic and round count.
2. Other players join with the room code; at least three players are required to start.
3. Each round assigns one player as the rat. Everyone else receives the same word.
4. Players submit clues in turn, then vote for the suspected rat.
5. The rat guesses the word before the app calculates points and displays the scoreboard.

Scoring rewards the rat for identifying the word or avoiding detection, while other players score for catching the rat, voting correctly, or preventing a correct guess.

## Getting Started

### Prerequisites

- Node.js `20.12.2`
- npm
- Firebase CLI `13.7.2`
- Firebase project credentials for the frontend services

### Install and Run

```bash
git clone https://github.com/SaoodCS/Rat-Hunt.git
cd Rat-Hunt
npm run app-install
npm run start
```

`npm run start` launches the Vite development server. To run the frontend and locally served Firebase backend together, use:

```bash
npm run app-start
```

### Environment Variables

Create `frontend/.env` with the Firebase web-app and App Check values used by `frontend/src/global/database/config/config.ts`:

```dotenv
VITE_APIKEY=
VITE_AUTHDOMAIN=
VITE_PROJECTID=
VITE_STORAGEBUCKET=
VITE_MESSAGINGSENDERID=
VITE_APPID=
VITE_MEASUREMENTID=
VITE_RECAPTCHASITEKEY=
VITE_APPCHECKDEBUGTOKEN=
```

The standalone backend maintenance scripts in `backend/functions/src/createDummyRoom` and `backend/functions/src/updateTopics` additionally read Firebase service-account fields from `backend/functions/.env`. Do not commit either environment file.

## Available Scripts

| Command | Description |
|---|---|
| `npm run app-install` | Installs root, frontend, backend, and shared dependencies |
| `npm run start` | Starts the frontend development server |
| `npm run app-start` | Starts the frontend and locally served Firebase backend concurrently |
| `npm run app-lint` | Runs TypeScript and ESLint checks across the monorepo |
| `npm --prefix frontend run test -- --run` | Runs the frontend Vitest suite once |
| `npm --prefix frontend run build` | Type-checks and builds the production frontend |
| `npm --prefix backend/functions run build` | Compiles the Cloud Functions package |
| `npm run app-deploy` | Deploys Firebase Hosting, then Cloud Functions |

## Architecture

```text
frontend/          React UI, routing, Firebase client access, PWA configuration
backend/functions/ Realtime Database trigger and Firebase maintenance scripts
shared/app/        Shared game types, rules, scoring, and state transitions
shared/lib/        Reusable typed utilities used by client and server
resources/         Architecture notes and README media
```

The frontend writes durable room state to Firestore and subscribes to each room document with `onSnapshot`. TanStack Query provides the client cache, while snapshot updates keep every player's UI aligned without polling.

Realtime Database is used as a focused presence channel. Each client registers an `onDisconnect` status update; the `onDataChange` Cloud Function compares before/after snapshots, mirrors status and deletion changes to Firestore, and removes users who remain disconnected for five minutes. Shared TypeScript types and `GameHelper` state transitions are imported by both the React app and Cloud Functions to reduce client/server rule drift.

## PWA

- A generated manifest configures standalone display, game/social categories, start URL, orientation, and 192/512 px icons.
- The service worker is registered immediately and uses automatic updates, outdated-cache cleanup, `skipWaiting`, and `clientsClaim`.
- Workbox applies a `NetworkFirst` strategy to Google APIs GET requests, with up to 500 cached responses retained for one day.
- The app detects installed/browser display modes and presents installation steps for iOS, Android, and desktop users.

The application shell is installable, but active multiplayer gameplay still depends on network access to Firebase; offline game-state editing or synchronization is not implemented.

## Testing and Quality

- Strict TypeScript configurations cover the frontend, backend, and shared packages.
- ESLint includes TypeScript, import, unused-code, Prettier, and security rules.
- The frontend uses Vitest with a jsdom environment and React Testing Library.
- Production builds remove `console` and `debugger` statements.
- Firebase App Check is configured with reCAPTCHA Enterprise and automatic token refresh.

Automated coverage is currently limited to a component rendering test. The repository does not contain a CI workflow, so lint, test, and build checks are run locally.

## Deployment

The React production build is deployed to Firebase Hosting at [rat-hunt.web.app](https://rat-hunt.web.app/), with SPA rewrites to `index.html`. Backend deployment targets Firebase Cloud Functions in the same `rat-hunt` project.

Deployment requires Firebase CLI authentication and access to that Firebase project:

```bash
firebase login
npm run app-deploy
```

## Engineering Decisions

- **Separate durable state from presence:** Firestore stores room/game data, while Realtime Database handles disconnect-aware presence events.
- **Share domain logic across runtimes:** Game types, phase transitions, scoring, and room mutations live in `shared/` and compile into both frontend and backend code.
- **Use snapshots as the real-time source:** Firestore listeners update the TanStack Query cache directly, avoiding repeated room fetches.
- **Treat disconnections as recoverable:** Players receive a five-minute reconnection window before server-side cleanup removes them from the room.
- **Keep PWA caching bounded:** Runtime API caching is limited by entry count and age, with stale cache cleanup enabled.

## Known Limitations and Roadmap

- Add CI checks for linting, tests, frontend builds, and Cloud Functions compilation.
- Provide sanitized `.env.example` files and a documented Firebase Emulator Suite workflow.
- Replace the in-process disconnect timeout with a durable cleanup mechanism.

## License

This project is licensed under the terms in [LICENSE.md](LICENSE.md).
