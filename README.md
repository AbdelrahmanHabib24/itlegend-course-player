# ITLegend Course Player

A modern, responsive e-learning course player and catalog application built with Next.js, React, and TypeScript, providing an interactive learning experience across desktop, tablet, and mobile devices.

## Overview

The application allows students to browse available courses in a catalog and engage with multi-format learning material inside a dedicated Course Player. Learners can watch video lectures with custom player controls and theater mode, study documents through an integrated PDF viewer, take timed quizzes and exams, track course progress, and participate in course discussions.

## Features

- **Course Catalog** — Filterable course listing displaying course information, ratings, lesson counts, difficulty levels, progress, and Start / Continue actions.
- **Custom Video Player** — HTML5 video playback with play/pause, seek controls, volume adjustment, fullscreen, theater mode, course-specific poster covers, and sticky positioning on mobile.
- **Curriculum Sidebar** — Collapsible course sections showing lesson types, completion states, lock states, and the currently active lesson.
- **Course Progress Tracking** — Dynamic progress calculation based on completed lessons with responsive progress indicators.
- **PDF Lesson Modal** — In-app document viewer supporting page navigation, zoom controls, download options, and lesson completion when the final page is reached.
- **Quiz & Exam Modal** — Timed multiple-choice assessments with answer selection, scoring, and retake support.
- **Course Materials & Discussions** — Course materials, instructor information, syllabus downloads, and student comments.
- **Quick Action Bar** — Quick access to Curriculum, Comments, Ask Question, and Leaderboard features.
- **Leaderboard** — Displays learner rankings, points, completed lessons, and current course progress.
- **Responsive Design** — Optimized layouts and interactions for desktop, tablet, and mobile devices.

## Tech Stack

- **Frontend** — Next.js 15 (App Router), React 19, TypeScript 5
- **Styling** — Tailwind CSS v4, PostCSS
- **Icons & Effects** — Lucide React, Canvas Confetti
- **State & Storage** — Custom React hooks with persistent `localStorage` progress state
- **Tooling** — ESLint 9, Node.js

## Getting Started

### Prerequisites

- Node.js 18.18+ or Node.js 20+
- npm

### Installation

1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/AbdelrahmanHabib24/itlegend-course-player.git
cd itlegend-course-player