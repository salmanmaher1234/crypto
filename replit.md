# C BOE - Investment Platform

## Overview
C BOE is a full-stack cryptocurrency investment platform providing customer and administrative interfaces for managing cryptocurrency trading orders, user accounts, and financial transactions. Its purpose is to offer a robust and user-friendly experience for cryptocurrency investment.

## Recent Changes
- **2025-10-14**: Fixed navigation routes in Profile component:
  - Fixed Personal Information button to use internal view system instead of non-existent /personal-information route
  - Fixed My Wallet button to use collection view instead of non-existent /funding-information route
  - Fixed Recharge page navigation to return to /customer instead of non-existent /profile route
  - Added Personal Information view displaying user details (username, name, email, phone, role, VIP level, credit score)
  - All Profile menu items now properly use internal view system matching Security Settings and Platform Wallet patterns
- **2025-10-14**: Successfully migrated from MySQL to PostgreSQL database:
  - Imported 326 users (including admin account)
  - Imported 291 active sessions, 241 betting orders, 137 transactions
  - Imported 21 bank accounts, 22 messages, 4 announcements
  - Updated schema with created_at/updated_at columns for all tables
  - Admin login: username=admin, password=admin123
  - Minor edge cases remain: 3 users with formatting issues, withdrawal requests pending foreign key resolution
- **2025-10-14**: Removed KSM/USDT and SUP/USDT cryptocurrencies from the platform:
  - Removed from backend crypto prices API (server/routes.ts)
  - Removed from home page crypto display (crypto-home.tsx)
  - Removed from marketplace page (crypto-marketplace.tsx)
  - Removed from single crypto view page (crypto-single.tsx)
  - Removed from trading page currency dropdown (crypto-trading.tsx)
  - Platform now displays 11 cryptocurrencies (was 13)
- **2025-10-14**: Trading improvements and UI updates:
  - Changed "Confirm" button to "Submit Order" in trade popup
  - Fixed settlement time accuracy: Reduced order expiration check interval from 10 seconds to 1 second for faster and more accurate order completion
  - Fixed settlement timing to start exactly from selected time: Countdown now calculated from displayStartTime (when order first appears) + duration, eliminating all network latency display issues
  - Orders now show exact selected duration in countdown (60s shows 01:00, 120s shows 02:00, 180s shows 03:00) from the moment they are placed
  - Fixed HTTP caching issue: Disabled ETags/304 responses for betting orders API to ensure real-time order status updates
  - Fixed auto-refresh issue: Changed global polling from invalidateQueries to refetchQueries for immediate UI updates with fresh data every second
  - Pending orders automatically move to Closed tab when settlement timing completes (no manual refresh needed)
  - Security: Backend validates client-provided expiresAt is within acceptable range and rejects manipulated timestamps
- **2025-10-14**: Market page complete UI redesign with fixes:
  - Clean white background with professional trading interface design
  - Header: BTC/USDT with grid menu icon for currency selection dropdown, "Spot Orders >" navigation button on right
  - Two-column stats layout: Left (Latest Price, 24H Rise Fall), Right (24H Highest/Lowest Price, Volume USDT/BTC, Transactions)
  - Timeframe controls: 1m, 30m, 1h, D buttons with tool icons (LineChart, Plus, Settings, Indicators dropdown)
  - Ticker line: "Bitcoin / TetherUS · 1D · Binance" with live price, change %, and volume
  - SMA 9 indicator display above chart
  - White background trading chart with blue line and gray volume bars
  - MACD 12 26 indicator display below chart with color-coded values
  - Bottom action buttons: Green Buy Up (#7CB342) and Red Buy Down (#FF6347) positioned above footer with proper spacing
  - All functionality preserved: Trading, currency selection, timeframe switching, order placement, Spot Orders navigation remain unchanged
- **2025-10-14**: Profile page complete UI redesign:
  - Clean white background design with profile header featuring green-bordered avatar with V1 badge
  - User info: Username, Real Balance, Frozen Amount, Credit Score with copy and visibility toggle buttons
  - Action buttons: Green Recharge button (#7CB342) and Purple Withdraw button (#7C3AED)
  - Menu items with colored icon backgrounds: Personal Information (blue), My Wallet (yellow), Security Settings (green), Platform Wallet (pink), Site Announcement (yellow), Site Message (orange), About Company (cyan)
  - Green Logout button at bottom matching brand colors
  - All functionality preserved: Navigation, bank account management, authentication, messages remain unchanged
- **2025-10-14**: Assets page complete UI redesign:
  - Removed Asset Information section (blue gradient with balance displays)
  - Simplified to clean header with "Asset" title and "Today" time filter dropdown
  - Three tabs: Recharges, Withdraws, Funds with purple (#7C3AED) bottom border for active state
  - Empty state: FileText icon with "No data available" message
  - Light gray background (bg-gray-50) for minimalist design
  - All functionality preserved: Tab switching, withdrawal records display, and data fetching remain unchanged
- **2025-10-14**: Orders tab UI redesign matching new specifications:
  - Redesigned tab navigation: Changed from "Position Order/Closing Order" to "Pending/Closed/Cancelled"
  - Updated tab styling: Simple text buttons with green (#7CB342) bottom border for active state
  - Enhanced empty state: FileText icon with "No data available" message matching design specifications
  - Improved visual consistency: Light gray background (bg-gray-50) with white content cards
  - All functionality preserved: Order filtering, time selection, detail view, and real-time updates remain unchanged
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