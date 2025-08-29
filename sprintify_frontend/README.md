# Sprintify - Project Management Tool

Sprintify is a modern project management application built with React and Vite, featuring an AI-powered chat assistant for intelligent issue creation and project planning.

## Features

- **Project Management**: Create and manage projects with team collaboration
- **Sprint Planning**: Organize work into sprints with backlog management
- **Kanban Board**: Visual task management with drag-and-drop functionality
- **AI Chat Assistant**: Intelligent issue creation using Google Gemini AI models
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## AI Chat Assistant

The AI Chat Assistant helps you create issues and plan features by understanding natural language requests. Simply click the floating chat button in any project to:

- Generate specific, actionable issues from feature descriptions
- Break down large features into manageable tasks
- Suggest story points and assign to appropriate epics
- Get project planning recommendations

### Setting up Gemini AI Integration

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `.env.example` to `.env.local`
3. Add your API key: `VITE_GEMINI_API_KEY=your_api_key_here`

**Note**: The AI assistant works with mock responses if no API key is configured.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd sprintify
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI Integration**: Google Gemini AI API
- **Backend**: Node.js/Express (separate repository)

## Development Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
