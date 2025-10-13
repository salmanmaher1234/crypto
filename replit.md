# C BOE - Investment Platform

## Overview
C BOE is a full-stack cryptocurrency investment platform providing customer and administrative interfaces for managing cryptocurrency trading orders, user accounts, and financial transactions. Its purpose is to offer a robust and user-friendly experience for cryptocurrency investment.

## Recent Changes
- **2025-10-13**: Trading fixes and balance update improvements:
  - Updated trading time scales: 60s→30%, 120s→40%, 180s→50% (frontend display and calculations)
  - Fixed Buy Down to generate profit instead of loss (both Buy Up and Buy Down now increase balance)
  - Enhanced admin Member Management with forced refetch for immediate balance updates after deposits
  - All profit calculations now use correct scale percentages matching backend logic
- **2025-10-13**: Fixed balance update delays and timezone display issues:
  - Fixed React Query staleTime from 5 seconds to 0 for immediate UI updates
  - Changed global refetchInterval from 30 seconds to false (disabled)
  - Set auto-invalidation interval to 1 second (from 10 seconds) for all key queries
  - Balance updates now appear within 1 second after deposits in admin Member Management
  - Created parseUTCTimestamp helper function for proper timezone conversion
  - Order date/time now displays in customer's local timezone (UTC timestamps converted correctly)
  - Fixed filtering logic to use correct local timezone for date comparisons
- **2025-10-13**: Admin UI redesign - white background theme:
  - Transformed admin interface from dark theme to clean white/light background
  - Updated all backgrounds: bg-gray-900/800/700 → bg-white/gray-50
  - Updated all text colors for proper contrast: text-gray-100/200/300 → text-gray-900/700
  - Updated all action buttons to light theme: bg-*-900 → bg-*-50 with text-*-700 (purple, blue, green, orange, red variants)
  - Table headers use bg-gray-50 with text-gray-700 for optimal readability
  - Implemented pagination in admin members screen (15 records per page) with navigation controls
  - All interactive elements (switches, selects, inputs) styled for light theme with proper borders and contrast
  - Grey borders added under admin menu items with icons for visual separation
- **2025-10-09**: Expanded homepage to display all 13 cryptocurrencies:
  - Updated crypto carousel to show all 13 currencies (3 visible at a time with left/right navigation)
  - Updated currency table to display all 13 currencies
  - Complete list: BTC/USDT, ETH/USDT, DOGE/USDT, CHZ/USDT, BCH/USDT, PSG/USDT, JUV/USDT, ATM/USDT, LTC/USDT, EOS/USDT, TRX/USDT, ETC/USDT, BTS/USDT
  - Fixed carousel scroll tracking with proper gap calculation and boundary clamping
  - Backend API now fetches all 13 currencies from CoinGecko with consistent USDT naming
  - Updated fallback data to include accurate prices for all 13 currencies
- **2025-10-09**: Complete homepage redesign (crypto-marketplace.tsx) matching screenshot specifications:
  - Header: Profile avatar, "Home" title, balance display with refresh icon
  - Banner slider: 2 slides (Crypto Exchange info, payment card) with auto-rotation and manual controls
  - Crypto cards carousel: Orange borders (#FF6B35), 3 visible at a time with navigation controls
  - Chart section: Dark gradient background with Litecoin, Bitcoin, Ripple, Ethereum trend indicators and SVG chart
  - Currency table: Real-time prices with conditional color coding (green for positive, red for negative)
  - Removed: Old top 3 crypto header, action buttons section
- **2025-10-09**: Fixed session persistence - users now stay logged in after page refresh:
  - Improved authentication hook to properly check sessionId from localStorage on mount
  - Query automatically validates session with server on page load
  - Invalid/expired sessions are properly cleared
  - Sessions last 30 days stored in database
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