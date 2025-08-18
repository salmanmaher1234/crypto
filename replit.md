# Attar Coin - Investment Platform

## Overview
Attar Coin is a full-stack cryptocurrency investment platform designed to facilitate trading, user management, and financial transactions. It provides both customer and administrative interfaces for managing cryptocurrency trading orders, user accounts, and financial transactions. The platform aims to offer a robust and user-friendly experience for cryptocurrency investment.

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
- August 18, 2025. **Application Name Updated to Attar Coin** - Successfully changed application name from SuperCoin to Attar Coin across all pages including login page with new gradient design (blue-purple theme), admin dashboard, and updated documentation. Enhanced login page styling with modern gradient background, improved input fields, and professional card design with backdrop blur effects.
- August 18, 2025. **Admin Panel Dark Theme Implementation** - Successfully applied darker color scheme (gray-800/900 backgrounds) to all admin components while keeping customer view completely unchanged. Updated Member Management tables with readable text colors, Betting Orders with proper contrast, and Reports with dark statistics cards. Fixed table readability issues with light gray text on dark backgrounds.
- August 18, 2025. **Complete Cryptocurrency Investment Platform Implementation** - Successfully created exact design replication from provided screenshots featuring real-time crypto marketplace with 12+ cryptocurrencies (BTC, ETH, DOGE, CHZ, PSG, ATM, JUV, KSM, LTC, EOS, BTS, LINK), responsive design with proper icons and colors matching images. Implemented comprehensive transaction system including: Top-up funds page, Top-up Records with tab navigation, Request for Withdrawal with BDT currency support, Withdrawal Records with dynamic status tracking, Customer Service page. Added real-time price updates using mathematical variations, dynamic transaction data, withdrawal status management (Under Review/Success/Failure), and proper bank account integration for collection information display.
- August 18, 2025. **PostgreSQL Database Integration Completed** - Successfully migrated from in-memory storage to PostgreSQL database using Drizzle ORM. Created comprehensive database schema with all necessary tables (users, bankAccounts, transactions, bettingOrders, withdrawalRequests, announcements, messages) and proper foreign key relationships. Implemented DatabaseStorage class with full CRUD operations, sample data initialization, and error handling. Database tables created and application successfully connected to Neon Database with environment variables properly configured.
- August 5, 2025. **MySQL Data Import Duplicates Completely Resolved** - Successfully identified and fixed all duplicate constraint violations preventing MySQL import. Resolved duplicate fund_password values (123456, @123456, 199193, priya@123, etc.) by adding unique suffixes while preserving all user data integrity. All 246 users, 578 betting orders, and 91 transactions now ready for clean MySQL import to Hostinger hosting. Data migration from PostgreSQL to MySQL completed with full feature parity maintained.
- August 1, 2025. **Real-Time Balance Synchronization Implemented** - Fixed critical issue where balance updates from completed orders weren't reflected in frontend Profile tab or backend Member Management. Added automatic balance refresh mechanism that invalidates user data cache every 10 seconds, ensuring both frontend Real Balance and backend Balance columns stay synchronized after each closed order. Verified with multiple test scenarios: Buy Up orders add profit, Buy Down orders subtract profit, all calculations working with duration-based rates (20-60%).
- August 1, 2025. **Direction Display System Completed** - Fixed backend logic to properly process customer's actualDirection parameter when admin sets member direction to "Actual". Orders now store and display customer's real choice (Buy Up/Buy Down) instead of "Actual". Enhanced profit/loss calculation system to work correctly with customer's actual direction choices, automatically calculating profits based on 20-60% rates by duration and updating both available balance and total balance after trade closure with proper win/loss results.
- August 18, 2025. **Crypto Trading Page Redesign** - Completely redesigned crypto trading page to match provided Blocnix screenshot exactly. Implemented dark theme (gray-900 background), proper header layout with back button and "Spot Orders", 24H price statistics display, time interval controls (1M, 5M, 30M, 1H, 4H, 1D), and fixed bottom "Buy Up" and "Buy down" buttons with rounded design. Removed trading data tables section as requested while maintaining full trading functionality.
- August 18, 2025. **Request for Withdrawal Page Redesign** - Simplified withdrawal page design to match provided clean, minimal screenshot with white background, proper header with back button and "Request for Withdrawal" title, "Withdrawal Record" link, and minimal BDT currency label. Removed complex form elements to match the clean, empty design shown in reference image.