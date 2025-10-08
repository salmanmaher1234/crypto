# SuperCoin - Deployment Guide

## Project Overview
This is a full-stack cryptocurrency investment platform built with React, PHP, and MySQL.

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: PHP (API endpoints)
- **Database**: MySQL (compatible with Hostinger)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query

## Getting Project Files

### From Replit
1. Download all files from this Replit project
2. The project structure includes:
   - `client/` - React frontend
   - `php/` - PHP backend
   - Configuration files (package.json, vite.config.ts, etc.)

## Server Setup Instructions

### Prerequisites
- PHP 7.4+ 
- MySQL database
- Hostinger shared hosting or similar
- npm or yarn package manager (for frontend)

### 1. Environment Setup
Edit `php/config/database.php` with your MySQL credentials:
```php
private $host = 'localhost';
private $db_name = 'your_database_name';
private $username = 'your_database_user';
private $password = 'your_database_password';
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Import database schema using phpMyAdmin or MySQL CLI
# File: php/database/schema.sql
```

### 4. Build the Frontend
```bash
npm run build
```

### 5. Deploy Files
- Upload `php/` folder to `public_html/php/`
- Upload React build files (`dist/`) to `public_html/`

## Database Schema
The application uses the following tables:
- `users` - User accounts and profiles
- `bank_accounts` - User payment methods
- `transactions` - Financial transaction history
- `betting_orders` - Cryptocurrency trading orders
- `withdrawal_requests` - User withdrawal requests
- `announcements` - Admin announcements

## Key Features
- **Customer Interface**: 
  - Crypto trading with Buy Up/Buy Down orders
  - Real-time balance tracking
  - Transaction history
  - Profile management
  - Betting orders tracking

- **Admin Interface**:
  - User management
  - Betting order monitoring
  - Financial oversight
  - Announcement system

## Security Notes
- Session-based authentication (PHP)
- Role-based access control
- Input validation
- Secure password handling

## Deployment Considerations
1. **URL Rewriting**: Use `.htaccess` for API and React routing
2. **SSL**: Configure HTTPS certificates
3. **Database**: Use managed MySQL service
4. **Environment Variables**: Secure configuration management
5. **Cron Jobs**: Use PHP cron for order processing

## Sample .htaccess Configuration
```apache
RewriteEngine On

# Handle API routes
RewriteRule ^api/(.*)$ php/index.php [QSA,L]

# Handle React routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]
```

## Default Admin Account
- Username: `admin`
- Password: `admin123`
- Email: `admin@supercoin.com`

## Default Customer Account  
- Username: `sarah`
- Password: `password123`
- Email: `sarah@email.com`

## Support
The application includes sample data for testing:
- Sample betting orders
- Demo crypto prices
- Test user accounts

For production use, replace sample data with real integrations.