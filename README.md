# Dungeons & Downbeats 🎵🎲

Your ultimate playlist manager for epic adventures. Organize your soundtracks by categories and subcategories to create the perfect atmosphere for every D&D campaign.

> **Note**: This is the frontend application. For the complete application, you'll also need the frontend:  
> 🔗 [DNDownbeats Backend](https://github.com/Elyeet9/dndownbeats-backend)


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build](#build)
  - [Linting](#linting)
- [API Integration](#api-integration)

## Overview

Dungeons & Downbeats is a Next.js-powered frontend application that helps Dungeon Masters and players manage their tabletop RPG soundtracks. Whether you're exploring ancient dungeons, engaging in epic battles, or enjoying peaceful tavern moments, find the perfect soundtrack to enhance your D&D experience.

## Features

- 📂 **Category Management** - Organize soundtracks into main categories
- 🎯 **Subcategories** - Create detailed subcategories for fine-tuned organization
- 🎵 **Soundtrack Library** - Manage your complete collection of audio tracks
- 🎨 **Beautiful UI** - Modern, gradient-themed interface with smooth transitions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** React 19
- **Build Tool:** Turbopack

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── categories/        # Category routes
├── components/            # React components
│   ├── CategoryCard.tsx
│   ├── SubcategoryCard.tsx
│   ├── SoundtrackCard.tsx
│   └── Create*.tsx        # Creation components
├── interfaces/            # TypeScript interfaces
├── services/              # API service layer
│   ├── CategoryService.ts
│   ├── SubcategoryService.ts
│   └── SoundtrackService.ts
└── utils/                 # Utility functions and constants
```

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun
- Backend API running (default: http://localhost:8000)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd dndownbeats-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables (optional)
```bash
# Create .env.local file
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_HOST=localhost
NEXT_PUBLIC_PORT=8000
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Build for production:

```bash
npm run build
npm start
```

### Linting

Run ESLint:

```bash
npm run lint
```

## API Integration

The application connects to a backend API with the following services:

- **CategoryService** - Manage categories
- **SubcategoryService** - Manage subcategories  
- **SoundtrackService** - Manage soundtracks

Default API endpoint: `http://localhost:8000/api`
