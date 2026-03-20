# 🇩🇿 Algeria History Quest

A premium educational web app for kids — explore the rich history of Algeria through interactive timelines, character profiles, and a 69-question map painting challenge.

---

## 🗂️ Project Structure

```
algeria-history-quest/
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── images/          ← Person portraits (e.g. abdelkader.jpg)
│       └── sounds/
│           ├── success.mp3  ← Correct answer celebration sound
│           └── error.mp3    ← Wrong answer feedback sound
│
├── src/
│   ├── main.jsx
│   ├── App.jsx              ← All routing
│   │
│   ├── context/
│   │   ├── AuthContext.jsx  ← Manual auth (localStorage)
│   │   └── GameContext.jsx  ← Celebration engine + audio
│   │
│   ├── data/
│   │   ├── timelineData.js  ← 9 historical stages
│   │   └── algeriaMapData.js ← 48 wilayas + 69 questions
│   │
│   ├── styles/
│   │   ├── Global.css       ← Childish theme, keyframes, utilities
│   │   ├── Timeline.css
│   │   ├── MapChallenge.css
│   │   └── Auth.css
│   │
│   └── components/
│       ├── common/
│       │   ├── NavHeader.jsx
│       │   └── Toast.jsx
│       ├── auth/
│       │   ├── LoginPage.jsx
│       │   └── SignupPage.jsx
│       ├── timeline/
│       │   └── Timeline.jsx
│       ├── people/
│       │   └── PeopleGrid.jsx  (+ PersonProfile export)
│       ├── games/
│       │   ├── GameHub.jsx
│       │   ├── MapChallenge.jsx
│       │   └── AlgeriaSVGMap.jsx
│       └── admin/
│           └── AdminDashboard.jsx
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open: http://localhost:3000

---

## 🔐 Auth System

- **Signup/Login**: Manual forms. Data stored in `localStorage` key `alhq_users`
- **Session**: Persisted via `alhq_session` key
- **Guest Access**: Can view Timeline and People. Map Challenge is locked.
- **Admin Login**: Navigate to `/admin` or use credentials:
  - Username: `admin_dz`
  - Password: `AlgeriaQuest2024!`

---

## 🗺️ Map Challenge

- **69 questions** in 7 rounds (click-to-identify + MCQ)
- Each correct answer **paints** one of Algeria's 48 wilayas
- Vibrant color cycling across 12 colors
- **Grand Finale** overlay at 69/69

---

## 🎨 Design System (`Global.css`)

| Variable | Value |
|----------|-------|
| `--color-purple` | `#7C3AED` |
| `--color-green` | `#22C55E` |
| `--font-display` | Fredoka One |
| `--font-body` | Nunito |
| `--radius-xl` | `50px` |

### Key Animations

- `float` — gentle up/down for nodes
- `bounceIn` — elastic entry for modals/cards
- `shake` — wrong-answer screen shake
- `pulseRing` — glow on active stage
- `waveBar` — audio narration wave bars
- `paintFill` — map region coloring
- `celebrateBounce` — correct answer dance

---

## 📁 Assets

Place files in `public/assets/`:

```
public/assets/
├── images/
│   ├── massinissa.jpg
│   ├── abdelkader.jpg
│   ├── kahina.jpg
│   └── ... (one per person)
└── sounds/
    ├── success.mp3
    └── error.mp3
```

Admin enters **only the filename** (e.g. `hero.png`) — the app auto-prefixes `/assets/images/`.

---

## 👑 Admin Dashboard (`/admin`)

- Add / edit / delete **Persons** (name, bio, image file, audio file)
- Add / edit / delete **Questions** (MCQ or map-click type)
- View all **registered users** and their progress
- All data stored in `localStorage` (extend to Firebase for production)

---

## 🛠️ Extending

### Add Firebase (Firestore)

Replace `localStorage` calls in `AuthContext.jsx` with Firestore reads/writes:
```js
// users collection: { username, password, completedQuestions, paintedRegions }
await setDoc(doc(db, 'users', uid), userData);
```

### Add Lottie Animations

```bash
npm install lottie-react
```
```jsx
import Lottie from 'lottie-react';
import confettiData from '../../public/assets/lottie/confetti.json';
<Lottie animationData={confettiData} loop={false} />
```

### Add Real SVG Map

Replace `WILAYA_PATHS` in `AlgeriaSVGMap.jsx` with paths from:
- https://geojson.io (export Algeria wilayas as SVG)
- Or use the `d3-geo` library to project GeoJSON

---

## 📱 Responsive

- Fully responsive via CSS Grid + Flexbox
- Mobile: timeline scrolls horizontally with drag
- Map: sidebar stacks below map on mobile
- Game hub: single column on small screens
