# C BOE - Investment Platform

## Overview
C BOE is a full-stack cryptocurrency investment platform providing customer and administrative interfaces for managing cryptocurrency trading orders, user accounts, and financial transactions. Its purpose is to offer a robust and user-friendly experience for cryptocurrency investment.

## Recent Changes
- **2025-10-09**: Added cryptocurrency trend chart section to customer homepage:
  - Dark gradient background (slate-800/900) with grid pattern
  - Displays Litecoin, Bitcoin, Ripple, Ethereum with trend indicators
  - SVG chart overlay with green candlestick bars and smooth trend line
  - Responsive design across all screen sizes
  - Positioned between crypto cards and currency table
- **2025-10-09**: Complete UI/UX redesign matching provided mockups:
  - Login page: Gradient logo, turquoise "Super Coin" branding, green login button (#7CB342), modern white layout
  - Global color scheme: Bright green primary (#7CB342), purple secondary, turquoise accent (#4FC3C3), orange/red highlights (#FF6B35)
  - Bottom navigation: Green highlights for active tabs across all customer pages
  - Home page: Blue/purple gradient banner, orange-bordered crypto cards on light gray background
  - Trading page: Green Buy Up (#7CB342), orange Buy Down (#FF6B35) buttons
  - Order page: Green underline tabs (Pending, Closed, Cancelled) with border-[#7CB342]
  - Assets page: Three functional tabs (Recharges, Withdraws, Funds) with green underline highlights, "No data available" empty states
- **2025-10-09**: Fixed error message display - API error responses now show clean, user-friendly messages instead of raw JSON (e.g., "You already have a pending withdrawal request" instead of "400: {"message":"You already have..."}"). Updated throwIfResNotOk function to properly parse JSON error responses.
- **2025-10-09**: Enhanced withdrawal request validation - prevents duplicate pending withdrawals using efficient database query (hasPendingWithdrawalRequest method) that avoids pagination issues.
- **2025-10-09**: Fixed balance calculation synchronization - both availableBalance and balance are now properly updated when placing and completing bets.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Build Tool**: Vite
- **UI/UX Decisions**: Comprehensive shadcn/ui component system, professional Binance/Blocnix-style trading charts with dark theme, responsive design, dynamic image scaling, no currency symbols in display, privacy toggles, card-based layouts, and blue-purple gradient themes for specific pages.

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple session-based authentication with role-based access control (customer/admin)
- **API Design**: RESTful API with JSON responses
- **Key Features**:
    - **User Management**: Roles (customer/admin), balances, trading preferences, VIP levels/reputation, ban/unban, withdrawal prohibition, credit score management.
    - **Trading**: Real-time balance tracking, Buy Up/Buy Down options, commission logic (20-60% based on duration), real-time price integration, server-side order completion, admin direction override.
    - **Financial Transactions**: Recharge system (manual admin intervention), withdrawal requests with admin approval/rejection, bank account management.
    - **Admin Controls**: Member management, betting order monitoring, wallet oversight, reporting, announcements, dynamic freeze/unfreeze, message sending, notification sounds.
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
- **@radix-ui/**: Accessible UI primitives
- **Vite**: Frontend build tool
- **TypeScript**: Language for type safety
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **CoinGecko API**: Real-time cryptocurrency price data