# GreenFund Frontend

A modern React-based frontend application for managing and monitoring agricultural sustainability metrics. This application provides farmers with tools to track their farms, monitor emissions, receive AI-powered crop suggestions, and earn badges for sustainable practices.

## Features

### 1. Interactive Dashboard (📊)

- *Farm Activity Monitoring*
  - Real-time activity feed with timestamp and status indicators
  - Visual activity icons and color-coded status
  - Automatic time-based updates using date-fns
- *Emissions Tracking*

  - Weekly CO2 emissions visualization
  - Daily emissions trend analysis
  - Interactive line charts with tooltips
  - Trend indicators (Increasing/Decreasing/Stable)

- *AI Crop Suggestions*

  - Smart crop recommendations based on soil data
  - Unique suggestion counter
  - Historical suggestion tracking
  - Integration with soil analysis data

- *Achievement System*
  - Gamified farming achievements
  - Progress tracking
  - Badge collection system
  - Motivational feedback

### 2. Farm Management (🗺)

- *Farm Registry*

  - Add and manage multiple farm properties
  - Property size and type tracking
  - Farm location mapping
  - Historical data tracking

- *Interactive Mapping*

  - Leaflet-based interactive maps
  - Farm boundary visualization
  - Location markers with details
  - Satellite view integration

- *Soil Analysis*
  - Soil data upload and processing
  - Health tracking over time
  - Results visualization
  - Smart recommendations

### 3. Community Features (👥)

- *Farmer Forum*

  - Discussion threads
  - Knowledge sharing platform
  - Expert advice section
  - Community support

- *Chat Support*
  - Real-time chat functionality
  - AI-powered chatbot
  - Expert connection system
  - File sharing capabilities

### 4. User Interface (📱)

- *Responsive Design*

  - Mobile-first approach
  - Adaptive layouts
  - Touch-friendly interface
  - Cross-device compatibility

- *Interactive Elements*
  - Smooth Framer Motion animations
  - Interactive Recharts visualizations
  - Toast notifications system
  - Dynamic loading states

### 5. Environmental Impact (🌍)

- *Emissions Monitoring*

  - CO2 emission calculations
  - Environmental impact scoring
  - Sustainability metrics
  - Improvement suggestions

- *Sustainability Features*
  - Eco-friendly practice recommendations
  - Resource usage tracking
  - Environmental achievement badges
  - Impact visualization

### 6. Data Analytics (📈)

- *Performance Metrics*

  - Farm productivity analysis
  - Resource utilization stats
  - Comparative benchmarking
  - Trend analysis

- *Reporting*
  - Custom report generation
  - Data export capabilities
  - Visual data summaries
  - Historical comparisons

## Tech Stack

- *Framework:* React 18
- *Build Tool:* Vite
- *Routing:* React Router DOM v6
- *Styling:* TailwindCSS
- *State Management:* React Context
- *API Integration:* Axios
- *Testing:* Jest + React Testing Library
- *Data Visualization:* Recharts
- *Maps:* React Leaflet
- *Animation:* Framer Motion
- *Date Handling:* date-fns
- *Icons:* React Icons

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:

   bash
   git clone https://github.com/Jwanjema/GreenFund-test-Frontend.git
   cd GreenFund-test-Frontend
   

2. Install dependencies:

   bash
   npm install
   

3. Start the development server:
   bash
   npm run dev
   

The application will be available at http://localhost:5173 by default.

## Available Scripts

- npm run dev - Start development server
- npm run build - Build for production
- npm run preview - Preview production build
- npm test - Run tests
- npm run test:watch - Run tests in watch mode

## Project Structure


GreenFund-test-Frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── __tests__/      # Test files
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── public/             # Public assets
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # TailwindCSS configuration
├── jest.config.js      # Jest configuration
└── package.json        # Project dependencies


## Testing

The project uses Jest and React Testing Library for testing. Tests are located in the src/__tests__ directory.

- Unit tests for components
- Integration tests for pages
- Mock implementations for external services
- Testing utilities and setup files

To run tests:

bash
npm test          # Run all tests
npm run test:watch   # Run tests in watch mode


## Key Components

1. *Dashboard*

   - Overview of farm metrics
   - Activity feed
   - Statistics cards
   - Emissions charts

2. *StatCard*

   - Reusable statistics display
   - Dynamic charts
   - Trend indicators

3. *ActivityItem*
   - Activity feed items
   - Status indicators
   - Timestamp display

## API Integration

The application uses Axios for API communication. API client configuration can be found in src/services/api.js.

Main endpoints:

- /farms/ - Farm management
- /badges/ - Achievement badges
- /activities/ - User activities
- /soil/ - Soil analysis data

## Styling

- TailwindCSS for utility-first styling
- Custom color schemes and typography
- Responsive design breakpoints

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## Environment Variables

Create a .env file in the root directory with the following variables:

env
VITE_API_BASE_URL=your_api_base_url


## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
