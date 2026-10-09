# ITLegend Course Player

A modern, responsive e-learning application built with **Next.js, React, and TypeScript**. ITLegend provides a course catalog and an interactive learning experience with video lessons, PDF materials, quizzes, progress tracking, and student discussions.

## Overview

ITLegend allows learners to browse available courses, track their progress, and study through a dedicated Course Player. The application supports multiple lesson types and provides responsive layouts for desktop, tablet, and mobile devices.

## Features

- **Course Catalog** — Browse and filter courses by available information, including ratings, difficulty levels, lesson counts, and progress. Start or continue a course directly from the catalog.
- **Custom Video Player** — HTML5 video playback with play/pause, seeking, volume controls, fullscreen, theater mode, and course-specific video thumbnails.
- **Curriculum Sidebar** — Expandable course sections with lesson types, current lesson indicators, completion states, and locked lesson states.
- **Course Progress Tracking** — Calculate course completion dynamically based on completed lessons, with progress indicators throughout the application.
- **PDF Lesson Viewer** — View course documents in an in-app modal with page navigation, zoom controls, download options, and lesson completion handling.
- **Quizzes & Exams** — Timed multiple-choice assessments with answer selection, scoring, and result displays.
- **Course Materials & Discussions** — Access course resources, instructor information, and student comments.
- **Quick Action Bar** — Navigate quickly to the curriculum and comments, or open the Ask Question and Leaderboard interfaces.
- **Leaderboard** — View learner rankings, points, completed lessons, and current-user highlighting.
- **Responsive Design** — Adapt layouts and interactions to desktop, tablet, and mobile screen sizes.

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, PostCSS |
| UI Feedback | Lucide React, canvas-confetti |
| State Management | React state and custom hooks |
| Persistence | `localStorage` for course progress |
| Code Quality | ESLint 9 |

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18.18+ or Node.js 20+
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AbdelrahmanHabib24/itlegend-course-player.git
   ```

2. Navigate to the project directory:

   ```bash
   cd itlegend-course-player
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

### Run the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Run the production server after a successful build:

```bash
npm run start
```

### Linting

Run ESLint to check the codebase:

```bash
npm run lint
```

## Data & State Management

- Course content is organized using structured mock data.
- Lesson completion and course progress are managed through React state and `localStorage`.
- Selecting a lesson updates the active lesson and its associated content.
- The course player supports different course structures and lesson types, including video lessons, PDFs, and quizzes.

## Responsive Support

The application supports desktop, tablet, and mobile layouts, with attention to readable content, accessible controls, and consistent navigation across screen sizes.

