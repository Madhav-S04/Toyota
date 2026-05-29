# Nippon Toyota Incentive Portal

A role-based web application for managing Toyota vehicle inventory and calculating monthly sales incentives for Sales Officers.

## Features

- Admin Portal for car inventory and incentive slab configuration
- Sales Officer Portal for monthly sales entry and real-time incentive preview
- JWT-based authentication
- Role-based access control for Admin and Sales Officer APIs
- Dynamic incentive slabs, including open-ended ranges such as `8+`

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT, bcrypt

## Project Structure

```text
nippon-toyota-project/
  backend/
    controllers/
    middleware/
    models/
    routes/
    server.js
    package.json
  frontend/
    src/
    public/
    package.json
```

## Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB, either local MongoDB or MongoDB Atlas

## Backend Setup

Open a terminal in the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nippon-toyota
JWT_SECRET=replace_with_a_strong_secret
PORT=5000
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

Open a second terminal in the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd run dev
```

## User Roles

### Sales Officer

Sales Officers can register from the public Register page. Public registration always creates a `sales` user.

Sales Officers can:

- Select a month
- Enter vehicle sales volume by model
- View the applicable incentive slab
- View the calculated monthly payout
- Save monthly sales records

### Admin

Admins cannot self-register from the public Register page. This is intentional so users cannot grant themselves admin access.

Admins can:

- Add, edit, and delete car models
- Configure incentive slabs
- Set open-ended slabs by leaving maximum cars blank

## Creating an Admin User for Local Testing

Because public registration creates Sales Officer accounts only, create an admin user manually for evaluation.

From the `backend/` folder, run this Node command after setting your `.env` values:

```bash
node -e "require('dotenv').config(); const mongoose=require('mongoose'); const bcrypt=require('bcryptjs'); const User=require('./models/User'); (async()=>{await mongoose.connect(process.env.MONGO_URI); const password=await bcrypt.hash('Admin@123',10); await User.findOneAndUpdate({email:'admin@example.com'},{name:'Admin User',email:'admin@example.com',password,role:'admin'},{upsert:true,new:true}); console.log('Admin created: admin@example.com / Admin@123'); await mongoose.disconnect();})();"
```

Demo admin credentials:

```text
Email: admin@example.com
Password: Admin@123
```

You can create a Sales Officer from the Register page, or use this example:

```text
Name: Sales Officer
Email: sales@example.com
Password: Sales@123
```

## Example Admin Data

### Car Inventory

| Model Name | Base Suffix | Variant |
|---|---|---|
| Glanza | G | Petrol Manual |
| Urban Cruiser Hyryder | G | Hybrid Automatic |
| Innova Hycross | VX | Hybrid Automatic |
| Fortuner | 4x2 | Diesel Automatic |
| Hilux | High | Diesel Manual |

### Incentive Slabs

| Slab Name | Minimum Cars | Maximum Cars | Incentive Per Car |
|---|---:|---:|---:|
| Bronze | 1 | 3 | 1000 |
| Silver | 4 | 7 | 2000 |
| Gold | 8 | leave blank | 3500 |

Leaving Maximum Cars blank creates an open-ended range such as `8+`.

## Incentive Calculation

The app applies the reached slab rate to the full monthly sales volume.

Example:

```text
8 cars sold
Applicable slab: Gold, 3500 per car
Total payout: 8 x 3500 = 28000
```

## Useful Commands

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend syntax check examples:

```bash
cd backend
node --check server.js
```

## Notes

- Keep both `frontend/package-lock.json` and `backend/package-lock.json`.
- The frontend expects the backend to run on `http://localhost:5000`.
- The backend requires a valid MongoDB connection before login, registration, and dashboard features will work.
