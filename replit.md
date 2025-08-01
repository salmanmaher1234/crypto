# SuperCoin - Investment Platform

## Overview
SuperCoin is a full-stack cryptocurrency investment platform designed to facilitate trading, user management, and financial transactions. It provides both customer and administrative interfaces for managing cryptocurrency trading orders, user accounts, and financial transactions. The platform aims to offer a robust and user-friendly experience for cryptocurrency investment.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Build Tool**: Vite
- **UI/UX Decisions**: Comprehensive shadcn/ui component system, professional Binance-style trading charts with dark theme, responsive design adapting to various screen sizes, dynamic image scaling for banners and sliders, no currency symbols in display, privacy toggles for sensitive information, card-based layouts for personal information.

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple session-based authentication with role-based access control (customer/admin)
- **API Design**: RESTful API with JSON responses
- **Key Features**:
    - **User Management**: Roles (customer/admin), balances, trading preferences, VIP levels/reputation (default 100), ban/unban, withdrawal prohibition, credit score management.
    - **Trading**: Real-time balance tracking, Buy Up/Buy Down options, commission logic (20-60% based on duration), real-time price integration (CoinGecko API), server-side order completion, direction override from admin.
    - **Financial Transactions**: Recharge system (manual admin intervention for balance update), withdrawal requests with admin approval/rejection, bank account management.
    - **Admin Controls**: Member management (search, add, delete), betting order monitoring, wallet oversight, reporting, announcements, dynamic freeze/unfreeze, message sending, notification sounds for new orders.
    - **Data Flow**: Secure authentication, balance validation for trading, financial transaction logging, role-based administrative actions.

### Component Structure
- **UI Components**: shadcn/ui
- **Business Components**: Separated by admin/customer roles
- **Shared Components**: Reusable across sections

## External Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@tanstack/react-query**: Server state management for data fetching and caching
- **wouter**: Lightweight React router
- **@radix-ui/**: Accessible UI primitives used by shadcn/ui
- **Vite**: Frontend build tool
- **TypeScript**: Language for type safety
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **CoinGecko API**: Real-time cryptocurrency price data

## Recent Changes
- August 1, 2025. **Real-Time Balance Synchronization Implemented** - Fixed critical issue where balance updates from completed orders weren't reflected in frontend Profile tab or backend Member Management. Added automatic balance refresh mechanism that invalidates user data cache every 10 seconds, ensuring both frontend Real Balance and backend Balance columns stay synchronized after each closed order. Verified with multiple test scenarios: Buy Up orders add profit, Buy Down orders subtract profit, all calculations working with duration-based rates (20-60%).
- August 1, 2025. **Direction Display System Completed** - Fixed backend logic to properly process customer's actualDirection parameter when admin sets member direction to "Actual". Orders now store and display customer's real choice (Buy Up/Buy Down) instead of "Actual". Enhanced profit/loss calculation system to work correctly with customer's actual direction choices, automatically calculating profits based on 20-60% rates by duration and updating both available balance and total balance after trade closure with proper win/loss results.