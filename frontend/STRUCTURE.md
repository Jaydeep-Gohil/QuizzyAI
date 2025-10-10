# QuizzyAI Frontend Structure

This document outlines the organized structure of the QuizzyAI frontend application.

## 📁 Folder Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Top navigation header
│   ├── NavItem.jsx     # Navigation item component
│   ├── Sidebar.jsx     # Left sidebar navigation
│   └── StatCard.jsx    # Statistics card component
├── context/            # React Context for state management
│   └── AppContext.jsx  # Main app state context
├── data/               # Mock data and constants
│   └── mockData.js     # All mock data (quizzes, events, etc.)
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard page
│   ├── EventsPage.jsx  # Quiz events management
│   ├── LandingPage.jsx # Landing/home page
│   ├── QuizDetailPage.jsx # Individual quiz details
│   ├── QuizzesPage.jsx # Quiz library page
│   ├── SettingsPage.jsx # User settings page
│   ├── SignInPage.jsx  # User sign in
│   ├── SignUpPage.jsx  # User registration
│   ├── StudentsPage.jsx # Student management
│   └── TakeQuizPage.jsx # Quiz taking interface
├── hooks/              # Custom React hooks (future use)
├── utils/              # Utility functions (future use)
├── App.jsx            # Main app component
├── App.css            # App-specific styles
└── index.css          # Global styles with Tailwind
```

## 🧩 Component Architecture

### Context Management
- **AppContext.jsx**: Centralized state management using React Context
- Manages authentication, navigation, and quiz state
- Provides `useApp()` hook for easy state access

### Reusable Components
- **Header.jsx**: Top navigation with search and user actions
- **Sidebar.jsx**: Left navigation with collapsible menu
- **NavItem.jsx**: Individual navigation item component
- **StatCard.jsx**: Statistics display card with icons and metrics

### Page Components
Each page is a self-contained component with its own logic and styling:
- **LandingPage.jsx**: Marketing/landing page with features showcase
- **SignInPage.jsx** & **SignUpPage.jsx**: Authentication pages
- **Dashboard.jsx**: Main dashboard with stats and recent activity
- **QuizzesPage.jsx**: Quiz library and management
- **QuizDetailPage.jsx**: Individual quiz analytics and management
- **TakeQuizPage.jsx**: Quiz taking interface
- **EventsPage.jsx**: Quiz events and scheduling
- **StudentsPage.jsx**: Student management and tracking
- **SettingsPage.jsx**: User preferences and account settings

## 📊 Data Management

### Mock Data
- **mockData.js**: Contains all static data including:
  - Quiz statistics
  - Sample quizzes
  - Events data
  - Student information
  - Categories and sample questions

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Consistent dark theme throughout
- **Purple/Pink Gradient**: Brand color scheme

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🔧 Dependencies

- **React 19.1.1**: UI library
- **Lucide React**: Icon library
- **Tailwind CSS**: Styling framework
- **Vite**: Build tool and dev server

## 📝 Features

- ✅ Responsive design
- ✅ Dark theme
- ✅ Component-based architecture
- ✅ Context-based state management
- ✅ Reusable components
- ✅ Clean separation of concerns
- ✅ Modern React patterns (hooks, context)
- ✅ TypeScript-ready structure

## 🔄 State Flow

1. **AppContext** provides global state
2. **useApp()** hook allows components to access/update state
3. **Page components** handle specific functionality
4. **Reusable components** receive props and callbacks
5. **Mock data** provides static content (ready for API integration)

This structure provides a solid foundation for scaling the application and integrating with backend APIs.
