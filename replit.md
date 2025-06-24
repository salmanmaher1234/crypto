# CryptoInvest Pro - Investment Platform

## Overview

CryptoInvest Pro is a full-stack cryptocurrency investment platform built with React, Express.js, and PostgreSQL. The application provides both customer and administrative interfaces for managing cryptocurrency trading orders, user accounts, and financial transactions.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Authentication**: Simple session-based authentication with in-memory session store
- **API Design**: RESTful API with JSON responses

### Component Structure
- **UI Components**: Comprehensive shadcn/ui component system
- **Business Components**: Separated by user role (admin/customer)
- **Shared Components**: Reusable components across different sections

## Key Components

### Database Schema
- **Users**: Core user management with roles (customer/admin), balances, and trading preferences
- **Bank Accounts**: User payment method storage
- **Transactions**: Financial transaction history and tracking
- **Betting Orders**: Cryptocurrency trading order management
- **Withdrawal Requests**: User withdrawal request processing
- **Announcements**: Administrative announcements system

### Authentication System
- Simple session-based authentication using cookies
- Role-based access control (customer/admin)
- Session persistence with localStorage for session ID storage
- Automatic session refresh on API requests

### Admin Features
- Member management with user account controls
- Betting order monitoring and management
- Wallet and transaction oversight
- Reporting and analytics dashboard
- Announcement system for user communication

### Customer Features
- Real-time balance tracking (total, available, in-trading)
- Cryptocurrency trading interface with Buy Up/Buy Down options
- Transaction history viewing
- Profile management

## Data Flow

1. **Authentication Flow**: User login → Session creation → Cookie/localStorage storage → API authentication
2. **Trading Flow**: User places order → Balance validation → Order creation → Real-time price tracking
3. **Transaction Flow**: Financial operations → Balance updates → Transaction logging → Audit trail
4. **Admin Flow**: Administrative actions → User account modifications → System-wide changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **@radix-ui/**: Accessible UI primitives

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **Tailwind CSS**: Utility-first styling framework
- **PostCSS**: CSS processing

## Deployment Strategy

### Production Build
- Frontend builds to `dist/public` using Vite
- Backend compiles to `dist/index.js` using esbuild
- Static assets served by Express in production

### Environment Configuration
- Development: `npm run dev` with hot reloading
- Production: `npm run build && npm run start`
- Database: Configured via `DATABASE_URL` environment variable

### Replit Configuration
- Configured for Node.js 20 with PostgreSQL 16
- Auto-scaling deployment target
- Port 5000 mapped to external port 80

## Changelog

Changelog:
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.