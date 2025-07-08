# SuperCoin - Investment Platform

## Overview

SuperCoin is a full-stack cryptocurrency investment platform built with React, Express.js, and PostgreSQL. The application provides both customer and administrative interfaces for managing cryptocurrency trading orders, user accounts, and financial transactions.

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
- June 24, 2025. Updated application name to SuperCoin and removed demo credentials from login page
- June 27, 2025. Enhanced crypto boxes slider with automatic infinite loop - one box slides every 2 seconds, seamless transition with duplicated array, manual navigation removed, automatically adapts to new cryptocurrencies
- June 27, 2025. Made home page content responsive at 1240px width with proper container max-width, responsive padding, scalable text sizes and adaptive grid layouts for crypto cards and investment banner
- June 27, 2025. Implemented comprehensive responsive design across entire application - all components now adapt to 1240px layout with scalable text sizes, responsive icons, adaptive padding and spacing, flexible grid layouts, and mobile-optimized navigation for both customer and admin interfaces
- June 27, 2025. Updated cryptocurrency prices to use static backend values and removed dollar signs from price display - all prices now match the provided image data with BTC at 107,314.24, ETH at 2,449.91, and other updated values without currency symbols
- June 27, 2025. Enhanced crypto trading pages with proper cryptocurrency names in headers and dynamic volume labels - each currency shows its own symbol (e.g., "24H Volume(BTC)" for Bitcoin, "24H Volume(ETH)" for Ethereum)
- June 27, 2025. Implemented real-time trading chart filters with time period selection (1m, 30m, 1h, 1D) and chart type toggles (candlestick/line) that dynamically update chart display - includes simulated real-time data changes every 3 seconds for authentic trading experience
- June 27, 2025. Upgraded trading charts to professional Binance-style interface with dark theme, grid lines, price labels, OHLC candlesticks with proper high/low wicks, volume indicators at bottom, current price line markers, and real-time data visualization for both candlestick and line chart modes
- June 27, 2025. Fixed order placement redirect issue - users now stay on the trading page after placing orders instead of being redirected to home page, allowing continuous trading on the same cryptocurrency
- June 27, 2025. Fixed balance update display issue - frontend now properly refreshes user balance after each order placement, ensuring real-time balance changes are visible after every transaction
- June 27, 2025. Enhanced Orders section with comprehensive time filtering system - added Today, Yesterday, Last Week, Last Month, Last 3 Months, All Orders, and Conditional Query options with date picker dialog for custom date range selection
- June 27, 2025. Fixed navigation issue from cryptocurrency trading pages - bottom navigation tabs now properly clear crypto view state when clicked, allowing seamless navigation between all sections
- June 27, 2025. Implemented dynamic real balance display with auto-refresh every 2 minutes and manual refresh icon - balance now shows user's actual balance from database, automatically updates every 2 minutes, includes spinning refresh icon for manual updates
- June 27, 2025. Added minimum order validation of 1000 - users cannot place orders with amounts less than 1000, validation implemented in both crypto-trading and trading-interface components with custom error message "Amount cannot be less than 1000" and input field hints showing minimum requirement
- June 27, 2025. Removed minimum amount hints from input placeholders and labels - validation now only shows inline red error text below input fields when user submits invalid amount, error clears when user starts typing
- June 27, 2025. Fixed refresh icon functionality in Place Order section - manual refresh icon now properly updates Real balance display according to current user balance from database with spinning animation and proper state management
- June 27, 2025. Removed refresh icon from Place Order section and implemented real-time balance synchronization - home page balance now automatically updates when orders are placed in trading section, both sections display availableBalance and sync through React Query cache
- June 27, 2025. Implemented real-time cryptocurrency price integration using CoinGecko API - replaced static backend prices with live market data for BTC, ETH, DOGE, LTC, CHZ, BCH and other cryptocurrencies including 24-hour price changes and trend indicators, automatically updates prices throughout the application
- June 27, 2025. Enhanced automatic price refresh system with 1-minute intervals - cryptocurrency prices now automatically update every 60 seconds across all components including home page and trading pages, prices continue updating even when browser is in background
- June 27, 2025. Removed visual live indicators from cryptocurrency sections - removed all pulsing green dots and "Live Prices" badges while maintaining automatic price refresh functionality, cleaner interface without visual indicators
- July 1, 2025. Successfully migrated from Replit Agent to standard Replit environment - fixed customer withdrawal functionality to properly create withdrawal requests, established PostgreSQL database connectivity, maintained all security practices and client/server separation
- July 1, 2025. Fixed withdrawal validation flow - customers must first add a bank account through Profile > My Wallet before being able to submit withdrawal requests, withdrawal system validates bank account existence and processes requests correctly
- July 2, 2025. Added profile image upload functionality - customers can now click on their avatar in the Profile section to upload a custom profile image, supports common image formats with 5MB size limit, provides visual feedback during upload process
- July 2, 2025. Enhanced profile privacy controls - added eye icon toggle to hide/show sensitive information (Real Balance, Frozen Amount, Credit Score) with visual asterisks masking, updated copy functionality to show "Copy Successful" confirmation message
- July 2, 2025. Enhanced recharge system with wallet integration - added wallet selection dropdown (ImToken, BitGet, TronLink, TokenPocket wallets), updated quick amount options (100-5000), implemented recharge prompt message section with validation rules and processing instructions
- July 2, 2025. Redesigned withdrawal interface with wallet selection flow - dropdown now shows only "1:1", "My wallet" button navigates to separate wallet selection page with Digital Wallet and Bank Wallet options, both pages now show placeholder messages for future implementation
- July 2, 2025. Added bank wallet management functionality - Bank Wallet page includes + icon to add new wallets, "Add Bank Wallet" form with fields for Holder's name, Bank Name, A/C No, IFSC Code, save functionality that integrates with existing bank account API
- July 2, 2025. Enhanced bank wallet display and management - saved bank accounts now display in image format with individual cards showing Holder's name, Bank Name, A/c No, IFSC Code with copy buttons and Modify/Delete functionality, supports both add and edit modes
- July 2, 2025. Implemented complete bank wallet modification system - added backend update API endpoint, frontend update hook, and full edit functionality allowing users to modify existing bank wallet details with proper form pre-filling and save operations
- July 2, 2025. Added complete bank wallet delete functionality - backend DELETE API endpoint, frontend delete hook with confirmation, real-time list updates after deletion with success/error notifications
- July 2, 2025. Enhanced Personal Information section with modern card-based layout - redesigned to match provided UI with Avatar, UserName, Gender (Confidential), and Signature fields, each with appropriate icons and navigation arrows
- July 2, 2025. Implemented interactive Personal Information functionality - Avatar click opens image upload with 5MB limit and validation, Gender click shows Male/Female/Confidential selection dialog, Signature click opens drawing area dialog for future signature creation, all with proper state management and toast notifications
- July 2, 2025. Enhanced signature functionality with canvas drawing area - added full drawing canvas with mouse and touch support, signature name input field, Clear/Cancel/Save buttons, converts signature to base64 image data for storage, includes drawing validation and success notifications
- July 2, 2025. Fixed recharge detail navigation - removed redirect after form submission, now uses back navigation to Assets tab, cleaned up debug logging, confirmed Transaction No. modification functionality working correctly
- July 2, 2025. Enhanced recharge form with channel selection - added "Select recharge wallet category" dropdown with Channel 01-04 options, recharge prompt message section, changed button text to "Submit", maintains same layout as provided design
- July 2, 2025. Reorganized recharge form layout - restructured order to: fast amount buttons, manual amount input with proper heading, channel selection, live processing prompt message, removed bank wallet selection from recharge dialog
- July 4, 2025. Reorganized admin panel button structure - removed first "Other" button, restructured button order to: Change a bank, Details, Order, Deposit, Deduction, Other, Freeze, Unfreeze, Change group with "$100" text removed from freeze/unfreeze buttons
- July 4, 2025. Implemented dynamic freeze/unfreeze functionality with custom amount dialog boxes - replaced fixed $100 amounts with user input fields, added validation and proper error handling
- July 4, 2025. Added comprehensive Add Member functionality - new members default to VIP Level/reputation of 100, includes username, email, password, name, and reputation fields with proper validation
- July 4, 2025. Enhanced VIP Level display system - admin panel shows reputation as "X/100" format with progress bar, customer profile displays Credit Score with privacy toggle, real-time updates through React Query
- July 4, 2025. Fixed in-memory storage to properly handle reputation values during user creation - now correctly uses passed reputation value instead of hardcoded 85
- July 4, 2025. Removed all $ currency signs throughout the application - replaced with clean number displays in balance cards, profile sections, admin panels, transaction history, betting orders, and wallet management components
- July 4, 2025. Updated crypto-home slider with new images - replaced default slider banners with provided crypto exchange, trading chart, and payment card images for enhanced visual appeal
- July 4, 2025. Replaced investment banner section with trading chart image - removed all text content and replaced with clean trading chart image display
- July 4, 2025. Removed 2nd image from slider - now displays only crypto exchange and payment card images (1st and 3rd positions)
- July 4, 2025. Completed final $ currency sign removal from admin betting orders and member management components
- July 4, 2025. Made slider and banner images fully responsive - consistent height scaling across all screen sizes (h-32 sm:h-36 md:h-40 lg:h-48 xl:h-52) with object-cover for proper aspect ratio
- July 4, 2025. Removed $ currency signs from Member Management Balance column - displays clean number format for Total amount, Available, and Frozen values
- July 4, 2025. Fixed slider and banner image container structure - now uses consistent fixed height containers with proper responsive scaling (h-32 to xl:h-52) ensuring all images have equal container sizes and full image height coverage with object-cover for all screen sizes
- July 4, 2025. Updated slider and banner to use automatic height - containers now adapt to image content height with h-auto, allowing images to display their full natural height while maintaining responsive behavior
- July 4, 2025. Set slider to fixed height 535.781px with responsive scaling - uses Tailwind classes h-[250px] on mobile up to xl:h-[535.781px] on extra large screens, both images now properly adjust to container with object-cover
- July 7, 2025. Implemented commission logic for trading orders - 30s=20%, 60s=30%, 120s=40%, 180s=50%, 240s=60% commission rates applied to order amounts and added to available balance
- July 7, 2025. Fixed order timing system with server-side setTimeout for exact duration completion - orders now close precisely at designated seconds instead of relying on frontend polling
- July 7, 2025. Fixed order number stability - order IDs now use timestamp-based generation to prevent changes during order duration
- July 7, 2025. Updated credit score system - all new members default to 100 reputation, existing customer updated from 85 to 100
- July 7, 2025. Added commission display to frontend - both trading-interface and crypto-trading components now show commission details with rates, amounts, and net calculations
- July 7, 2025. Removed Commission Details section from Place Order dialogs per user request - simplified order placement interface
- July 7, 2025. Implemented scale-based profit calculation - 30s=20%, 60s=30%, 120s=40%, 180s=50%, 240s=60% profit rates based on order duration
- July 7, 2025. Fixed order cache invalidation - orders now appear immediately in pending section after placement without requiring logout/login
- July 7, 2025. Enhanced balance synchronization - profits from closed orders automatically update Real Balance in profile and backend member management
- July 7, 2025. Fixed automatic order completion display - orders now automatically move from pending to closed tab after billing time expires, implemented 5-second auto-refresh cache invalidation to ensure real-time updates across frontend
- July 7, 2025. Updated all profit calculations to use scale-based percentages - 30s=20%, 60s=30%, 120s=40%, 180s=50%, 240s=60% consistently applied across order list view, detail view, and copy functionality
- July 7, 2025. Enhanced real-time balance synchronization with 2-second auto-refresh intervals - profile Real Balance, admin member management, and betting orders now sync automatically to show accurate balance updates after order completion
- July 7, 2025. Fixed balance calculation issues - ensured exact order amount deduction (no double deduction) and proper profit amount addition to customer's Real Balance with comprehensive logging for debugging
- July 7, 2025. Fixed order completion balance calculation - order amount plus profit now properly returns to available balance instead of just profit, ensuring correct balance restoration
- July 7, 2025. Fixed admin panel total balance display - Total now correctly calculated as Available + Frozen balance instead of showing incorrect balance field value across member management and wallet management components
- July 7, 2025. Fixed recharge functionality to prevent automatic balance updates - recharge now only shows processing dialog and confirmation message without updating user balance, requiring manual admin intervention for actual balance changes
- July 7, 2025. Enhanced withdrawal system with comprehensive admin controls - withdraw button now always clickable, added note field to withdrawal requests schema, implemented Accept/Reject functionality with rejection reason notes in admin Wallet Management, rejection notes display to customers in Assets section
- July 7, 2025. Added comprehensive Bank Account Details section to admin Wallet Management - displays all member bank accounts with owner details, account numbers, IFSC codes, and copy functionality for easy access to customer banking information

## User Preferences

Preferred communication style: Simple, everyday language.