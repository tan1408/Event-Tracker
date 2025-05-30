# Event Tracker

A modern event management platform built with React that allows users to create, manage, and attend events with features like RSVP management, ticket generation, and QR code scanning.

![Event Tracker Screenshot](https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop)

## Features

- **Event Management**
  - Create and manage events with detailed information
  - Set event capacity limits
  - Upload event images
  - Categorize events
  - Add location and date/time details

- **RSVP System**
  - Register for events with capacity tracking
  - Generate unique QR code tickets
  - View and manage your RSVPs
  - Cancel registrations

- **User Management**
  - User authentication and authorization
  - Personal dashboard
  - Profile management
  - Event history tracking

- **Search & Discovery**
  - Browse events by category
  - Search functionality
  - Filter events by date, price, and location
  - Featured events section

## Tech Stack

- **Frontend**
  - React.js 18 (Functional Components + Hooks)
  - React Router v6 for navigation
  - React Context API for state management
  - Tailwind CSS for styling
  - React Icons for iconography
  - React QR Code for ticket generation
  - React DatePicker for date inputs
  - React Toastify for notifications

- **State Management**
  - Context API for auth and events
  - Local Storage for persistence

- **Development Tools**
  - Vite for build tooling
  - ESLint for code linting
  - PostCSS for CSS processing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event-tracker.git
cd event-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage Examples

### Creating an Event

1. Log in to your account
2. Navigate to "Create Event"
3. Fill in event details:
   - Title and description
   - Date and time
   - Location
   - Capacity
   - Category
   - Event image

### Managing RSVPs

As an event organizer:
1. Go to your dashboard
2. Select an event
3. View attendee list
4. Monitor capacity
5. Download attendee data

As an attendee:
1. Browse events
2. Click "RSVP" on an event
3. Fill in registration details
4. Receive QR code ticket
5. Access ticket from dashboard

## Project Structure

```
event-tracker/
├── src/
│   ├── components/
│   │   ├── common/         # Reusable components
│   │   ├── events/         # Event-related components
│   │   ├── layout/         # Layout components
│   │   └── tickets/        # Ticket-related components
│   ├── context/           # React Context providers
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── main.jsx         # App entry point
├── public/              # Static assets
└── package.json        # Project dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)