# Ai-researcher.net clone

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/zmf2326128714-9054s-projects/v0-ai-researcher-net-clone)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/UjaN9C6KfbE)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/zmf2326128714-9054s-projects/v0-ai-researcher-net-clone](https://vercel.com/zmf2326128714-9054s-projects/v0-ai-researcher-net-clone)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/UjaN9C6KfbE](https://v0.dev/chat/projects/UjaN9C6KfbE)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Local Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Project Structure

```
frontend/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── styles/             # Global styles and CSS
└── package.json        # Project dependencies
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Integration

This frontend connects to the DeepMarker backend API. Make sure the backend service is running on `http://localhost:8002` before starting the frontend development server.

For backend setup instructions, see the [backend README](../backend/README.md).
