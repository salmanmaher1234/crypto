# C BOE - Investment Platform

## Overview
C BOE is a full-stack cryptocurrency investment platform offering customer and administrative interfaces. Its core purpose is to provide a robust and user-friendly experience for managing cryptocurrency trading orders, user accounts, and financial transactions. The platform aims to facilitate cryptocurrency investment with features like real-time trading, secure financial operations, and comprehensive administrative controls.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Build Tool**: Vite
- **UI/UX Decisions**: The platform utilizes a comprehensive shadcn/ui component system. Design principles include professional trading interfaces (Binance/Blocnix-style), responsive layouts, card-based designs, and dynamic image scaling. Color schemes are primarily white/light backgrounds for admin and specific customer pages, with bright green, purple, turquoise, orange, and red highlights. Privacy toggles and no currency symbols in displays are also key UI decisions.

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple session-based authentication with role-based access control (customer/admin).
- **API Design**: RESTful API with JSON responses.
- **Key Features**:
    - **User Management**: Includes roles, balances, trading preferences, VIP levels, credit scores, and admin controls for banning/unbanning users and managing withdrawal prohibitions.
    - **Trading**: Supports real-time balance tracking, "Buy Up" and "Buy Down" order types, commission logic (20-60% based on duration), real-time price integration, and server-side order completion with potential for admin direction override.
    - **Financial Transactions**: Features a manual admin-intervened recharge system, withdrawal requests requiring admin approval, and bank account management.
    - **Admin Controls**: Provides tools for member management, betting order monitoring, wallet oversight, reporting, announcements, dynamic freeze/unfreeze capabilities, message sending, and notification sounds.
    - **Data Flow**: Emphasizes secure authentication, balance validation for all trading activities, comprehensive financial transaction logging, and role-based administrative actions to ensure data integrity and security.

### System Design Choices
- **Real-time Updates**: Implemented through efficient React Query invalidation and refetching mechanisms to ensure immediate UI updates, particularly for order statuses and balances.
- **Error Handling**: API error responses are processed to display clean, user-friendly messages rather than raw JSON.
- **Session Management**: User sessions are persistent across page refreshes and stored in the database for 30 days.
- **Database Migration**: Successfully migrated to PostgreSQL, ensuring all critical data (users, sessions, orders, transactions, bank accounts, messages, announcements) are preserved and schema updated.

## External Dependencies
- **@neondatabase/serverless**: For PostgreSQL database connectivity.
- **drizzle-orm**: Type-safe ORM for PostgreSQL.
- **@tanstack/react-query**: For server state management, data fetching, and caching.
- **wouter**: A lightweight routing library for React.
- **@radix-ui/**: Provides accessible UI primitives.
- **Vite**: Frontend build tool.
- **TypeScript**: Used for type safety across the application.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **PostCSS**: For transforming CSS with JavaScript plugins.
- **CoinGecko API**: Utilized for fetching real-time cryptocurrency price data.