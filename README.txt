C BOE PLATFORM - REACT.JS + PHP + MYSQL
==========================================

✅ CLEAN PROJECT STRUCTURE:

📦 Project Root
├── client/                    # React.js Frontend
│   ├── src/                  # React components (.jsx files)
│   ├── package.json          # React dependencies
│   └── vite.config.js        # React build config
├── php/                      # PHP Backend 
│   ├── api/                  # REST API endpoints
│   ├── config/database.php   # MySQL connection
│   ├── database/schema.sql   # MySQL database schema
│   └── index.php             # PHP entry point
├── run-app.sh                # Startup script
└── server.js                 # Development launcher

🚀 HOW TO RUN:
1. Import database: mysql -u root cboe < php/database/schema.sql
2. Start servers: ./run-app.sh
   - PHP Backend: http://localhost:8080
   - React Frontend: http://localhost:5000

✨ FEATURES:
• SUP Cryptocurrency Trading (not DOGE)
• INR Currency Support (not BDT)  
• Indian Banking System (nullable Branch/IFSC)
• Admin & Customer Dashboards
• MySQL Database (not PostgreSQL)
• No TypeScript - Pure React.js + PHP

🔧 TECHNOLOGY STACK:
Frontend: React.js + Vite + TailwindCSS
Backend: PHP + MySQL
Architecture: SPA Frontend + REST API Backend