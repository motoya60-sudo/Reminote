# Reminote

Remote work management application built with React Native (Expo) and Node.js.

## Project Structure

```
Reminote/
├── api/                 # Backend API (Node.js/Express)
├── app/                 # Frontend App (React Native/Expo)
├── docs/                # Documentation
├── shared/              # Shared libraries and types
├── .gitignore
├── env.example
├── package.json         # Root package management
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- npm (>=8.0.0)
- Expo CLI (for mobile development)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Reminote
```

2. Install all dependencies
```bash
npm run install:all
```

3. Set up environment variables
```bash
cp env.example .env
# Edit .env with your configuration
```

### Development

Start both API and app in development mode:
```bash
npm run dev
```

Or start them separately:
```bash
# Start API server
npm run dev:api

# Start mobile app
npm run dev:app
```

### Available Scripts

- `npm run dev` - Start both API and app
- `npm run dev:api` - Start API server only
- `npm run dev:app` - Start mobile app only
- `npm run build` - Build both API and app
- `npm run test` - Run all tests
- `npm run install:all` - Install all dependencies
- `npm run clean` - Clean all node_modules

## API

The API server runs on port 3000 by default.

### Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Mobile App

The mobile app is built with React Native and Expo.

### Features

- User authentication
- Remote work tracking
- Team collaboration
- Real-time notifications

## Documentation

See the `docs/` folder for detailed documentation:
- API documentation
- Database schema
- Deployment guide
- Contributing guidelines

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
