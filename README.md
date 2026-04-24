# Flash404: HTTP Status Code Mastery

## OVERVIEW
**Flash404** is a high-performance, minimalist web application designed for developers and engineers to master HTTP status codes through science-backed learning methods. It combines a clean, distraction-free interface with a powerful Spaced Repetition System (SRS) to move technical knowledge from short-term memory to long-term mastery.

---

## SRS LOGIC
The core of the application is the Spaced Repetition System. The following diagram illustrates the relationship between user actions (Again, Hard, Good, Easy) and the card levels (0-5).

<!-- ![SRS State Transition Diagram](assets/transition_diag.png) -->

![SRS State Transition Diagram SVG](assets/Flash404_svg.svg)

---

## FEATURES

### 1. Spaced Repetition System (SRS)
- **Time-Optimized Learning**: Uses a 6-level progression system (Level 0 to Level 5) with intervals ranging from 1 day to 4 weeks.
- **Performance-Based Scheduling**: Cards reappear based on your recall difficulty: *Again, Hard, Good, or Easy*.
- **Learning Boost**: New cards (Level 0) skip levels to reach relevant intervals faster if you find them easy.

### 2. Flexible Practice Modes
- **Scheduled Review (SRS)**: The primary mode that shows only cards "due" for review, preventing memory decay.
- **Free Practice Mode**: Allows users to "brute force" their learning by practicing all cards in a set immediately, bypassing the 24-hour wait time.

### 3. Curated & Custom Study Sets
- **Pre-configured Sets**: Quick start with "Top 10", "Top 16", or "Top 20" most essential status codes.
- **Custom Selection**: A powerful configuration modal where users can build their own curriculum from the 62 available codes.
- **Categorical Selection**: Codes are grouped into standard classes (Informational, Success, Redirect, Client Error, Server Error) for intuitive filtering.

### 4. Interactive Library
- **Accordion Organization**: A searchable library that groups all codes into their respective HTTP classes with fluid animations.
- **Visual Progress**: Real-time level indicators and mastery badges for every code in the library.

### 5. Professional UI/UX
- **Clean Minimalism**: A high-contrast, "glass-card" aesthetic reduces cognitive load.
- **Hardware Accelerated Animations**: Powered by `motion` for smooth, responsive state transitions and layout shifts.
- **Keyboard Optimization**: Seamless study flow using `Space` and numeric keys for zero-latency review sessions.

### 6. Cloud Sync & Multi-User Support
- **Authentication**: Secure Google Login via Firebase Auth.
- **Persistence**: Real-time progress synchronization with Cloud Firestore.
- **Cross-Device**: Your mastery levels and study sets follow you across any device.

---

## ARCHITECTURE

### Tech Stack
- **Frontend**: React 18+ with Vite
- **Backend-as-a-Service**: Firebase (Auth & Firestore)
- **Styling**: Tailwind CSS
- **Animations**: motion
- **Icons**: Lucide-React

### Component Structure
- `App.tsx`: Central hub managing routing, Auth state, and session configuration.
- `Dashboard.tsx`: Performance console displaying progression stats, study sets, and mode selection.
- `Flashcard.tsx`: The core interaction engine handling flip states, keyboard events, and SRS transitions.
- `ListView.tsx`: The searchable knowledge base used for reference and exploration.
- `src/lib/firebase.ts`: Initialization and service layer for Google Cloud integration.

### Logic Layer (`/src/lib/srs.ts`)
- **Memory Engine**: Encapsulates the mathematical algorithms for level transitions and time-based review scheduling.
- **Data Filtering**: Handles complex grouping of codes and status calculations across multiple practice sets.

---

## DEPLOYMENT (Firebase Hosting)

To host Flash404 independently on your own Google Cloud/Firebase project:

### 1. Project Initialization
- **GitHub**: Export your code to a repository and clone it locally.
- **Console**: Create a new project in the [Firebase Console](https://console.firebase.google.com/).
- **Provision**: Enable **Authentication** (Google Provider) and **Cloud Firestore** in your preferred region.

### 2. Local Configuration
Since `firebase-applet-config.json` is ignored by Git, you must create it manually in the project root:

```json
{
  "projectId": "your-project-id",
  "appId": "your-app-id",
  "apiKey": "your-api-key",
  "authDomain": "your-project-id.firebaseapp.com",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "your-project-id.firebasestorage.app",
  "messagingSenderId": "your-sender-id"
}
```
*You can find these values in your Firebase Console under **Project Settings > General > Your apps**.*

### 3. Tooling & Initialization
- **Install Dependencies**: Run `npm install` to download required libraries (Vite, React, etc.).
- **Install Firebase CLI**: `npm install -g firebase-tools`.
- **Login**: `firebase login`.
- **Init**: `firebase init hosting`.
  - Select your project from the list.
  - Public directory: `dist`.
  - Configure as SPA: `Yes`.

### 4. Build & Publish
- **Build**: `npm run build`.
- **Deploy**: `firebase deploy --only hosting`.
- **Authorize**: Add your new hosting URL to the **Authorized Domains** list in **Authentication > Settings**.

---

## PROGRESSIVE ENHANCEMENT SUMMARY

The application evolved through a series of tactical enhancements to transition from a simple flashcard tool to a comprehensive study platform:

1.  **Core interaction**: Established the basic SRS flashcard loop and status code viewer.
2.  **Logic Hardening**: Implemented critical bug fixes, such as the flashcard state reset to ensure every new card starts face-up.
3.  **UI Polish**: Refined the aesthetic by removing intrusive keyboard hints and adopting a consistent minimalist visual language.
4.  **Structural Organization**: Upgraded the Library from a flat list to a categorical **Accordion-based system** for better information hierarchy.
5.  **Curriculum Control**: Introduced **Pre-configured Study Sets**, allowing users to focus on high-priority codes rather than the entire 62-card deck.
6.  **Granular Customization**: Developed the **Custom Study Set Modal**, featuring categorical selections that mirror the Library layout for a unified UX.
7.  **Architectural Expansion**: Shifted from a schedule-only app to a **Multi-Mode Architecture**, introducing "Free Practice" to allow users to bypass the 24-hour SRS timer whenever they want.
8.  **Cloud Integration**: Transitioned from LocalStorage to **Firebase Auth & Firestore**, enabling multi-user support, secure Google login, and persistent cross-device progress.
