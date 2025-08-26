# Overview

COBE is a comprehensive cryptocurrency trading platform that provides both customer-facing trading interfaces and administrative management tools. The platform enables users to trade cryptocurrencies, manage digital wallets, place betting orders, and handle withdrawals. It includes administrative features for user management, transaction monitoring, and system configuration. The application supports real-time trading with TradingView integration and provides a complete financial ecosystem for cryptocurrency operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built using React 18 with TypeScript, utilizing Vite as the build tool and development server. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system. Tailwind CSS handles styling with a custom configuration supporting dark mode and CSS variables for theming. The architecture follows a component-based structure with separate directories for customer and admin interfaces.

## State Management
React Query (TanStack Query) serves as the primary state management solution for server state, handling API calls, caching, and synchronization. Local component state is managed through React hooks, while form handling is implemented using React Hook Form with Zod validation resolvers.

## Routing and Navigation
The application implements client-side routing with React Router, supporting nested routes for admin and customer sections. The routing system includes protected routes with authentication checks and role-based access control.

## Authentication System
Session-based authentication is implemented with session IDs stored in localStorage. The system supports role-based access (admin, customer) with different permission levels and interface restrictions.

## Backend Architecture
The backend is designed as a hybrid system supporting both Node.js/Express and PHP implementations. The Node.js version uses Express with TypeScript, while the PHP version provides alternative API endpoints. Both backends are configured to handle the same API routes with consistent response formats.

## Database Layer
Database operations are managed through Drizzle ORM, providing type-safe database queries and schema management. The system is configured to support both PostgreSQL (via Neon) and SQLite databases, with the ability to switch between them based on deployment requirements.

## Trading Integration
TradingView widgets are integrated for real-time cryptocurrency charts and market data. The platform supports multiple cryptocurrency pairs with live price feeds and technical analysis tools.

# External Dependencies

## UI and Component Libraries
- **Radix UI**: Complete set of unstyled, accessible UI primitives including dialogs, dropdowns, tooltips, and form controls
- **shadcn/ui**: Pre-built components using Radix UI with consistent styling and theming
- **Framer Motion**: Animation library for smooth transitions and interactive elements
- **Lucide React**: Icon library providing consistent iconography throughout the application

## State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form handling with validation and error management
- **Hookform/Resolvers**: Integration between React Hook Form and validation libraries

## Styling and Design
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **next-themes**: Theme switching functionality for dark/light mode support
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Utility for constructing className strings conditionally

## Database and ORM
- **Drizzle ORM**: TypeScript ORM with support for multiple database providers
- **Drizzle Kit**: Database migration and schema management tools
- **Neon Database**: Serverless PostgreSQL database service
- **Better SQLite3**: Local SQLite database support for development

## Trading and Financial Data
- **TradingView**: Embedded charting widgets for cryptocurrency market data and technical analysis
- **Real-time Price APIs**: Integration with cryptocurrency exchanges for live market data

## Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **esbuild**: JavaScript bundler for production builds
- **TypeScript**: Static type checking and enhanced developer experience
- **PostCSS**: CSS processing with Tailwind CSS integration

## Session Management
- **Express Session**: Server-side session management for user authentication
- **Connect PG Simple**: PostgreSQL session store for Express sessions
- **Cookie Parser**: Cookie handling middleware for Express applications