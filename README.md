# Sianna Travel

Modern, high-performance travel agency website built with React + Node.js.

## Architecture

```
siannatravel/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Feature-based modules
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer
│   │   ├── utils/        # Utilities & helpers
│   │   └── assets/       # Static assets
│   └── public/
├── server/          # Node.js backend (Express)
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic & external APIs
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/       # Configuration
│   │   └── utils/        # Utilities
│   └── package.json
└── vercel.json      # Vercel deployment config
```

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Development (runs both client & server)
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create `.env` files in both `client/` and `server/` directories. See `.env.example` files for reference.

### Server (.env)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `N8N_WEBHOOK_URL` - n8n webhook base URL
- `AIRLINE_API_KEY` - External airline API key
- `CORS_ORIGIN` - Allowed CORS origin

### Client (.env)
- `VITE_API_URL` - Backend API URL

## Deployment (Vercel)

The project is configured for Vercel deployment with `vercel.json`. Push to GitHub and connect the repo to Vercel.

## Tech Stack

- **Frontend**: React 18, Vite, React Router, CSS Modules
- **Backend**: Node.js, Express
- **Deployment**: Vercel
- **Automation**: n8n webhooks
