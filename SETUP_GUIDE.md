# 🚀 RentEase Setup Guide

## ✅ Prerequisites Checklist
- [x] Node.js v22.16.0 - Installed ✓
- [x] npm v10.9.2 - Installed ✓
- [x] Dependencies - Installed ✓
- [ ] MongoDB - **NOT INSTALLED**

---

## 📦 Step 1: Install MongoDB

### **Option A: Install MongoDB Locally (Recommended)**

1. **Download MongoDB Community Edition:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Version: Latest (7.0+)
   - Package: MSI

2. **Install MongoDB:**
   - Run the downloaded MSI installer
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool) - optional but helpful

3. **Verify Installation:**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service (if not running):**
   ```powershell
   net start MongoDB
   ```

### **Option B: Use MongoDB Atlas (Cloud - Free Tier)**

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Free Cluster:**
   - Choose "Create a FREE cluster"
   - Select your preferred cloud provider and region
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access:**
   - Go to "Database Access" → "Add New Database User"
   - Create username and password
   - Grant "Read and write to any database" privileges

4. **Setup Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String:**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/rentease`

---

## 🔧 Step 2: Configure Environment Variables

1. **Open the `.env` file in the server folder:**
   ```
   server/.env
   ```

2. **Update with your MongoDB connection:**

   **For Local MongoDB:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rentease
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

   **For MongoDB Atlas:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/rentease?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

3. **Replace placeholders:**
   - `<username>` - Your MongoDB Atlas username
   - `<password>` - Your MongoDB Atlas password
   - `JWT_SECRET` - Any random secret string (e.g., "mySuper$ecretKey123!")

---

## 🌱 Step 3: Seed Database (Optional but Recommended)

This will create test users and sample property listings:

```powershell
cd server
node seedData.js
```

**Test Accounts Created:**
- **Owner:** rajesh.owner@example.com | Password: password123
- **Owner:** priya.owner@example.com | Password: password123
- **Renter:** sneha.renter@example.com | Password: password123
- **Renter:** vikram.renter@example.com | Password: password123

---

## 🚀 Step 4: Run the Application

### **Method 1: Run Both (Client + Server) Together**

From the root directory:
```powershell
npm run dev
```

This will start:
- Backend server on: http://localhost:5000
- Frontend app on: http://localhost:3000

### **Method 2: Run Separately**

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

---

## 🌐 Access the Application

Once running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

---

## 🎯 Quick Start Summary

```powershell
# 1. Install MongoDB (see options above)

# 2. Update server/.env with MongoDB connection

# 3. Seed database (optional)
cd server
node seedData.js

# 4. Run application
cd ..
npm run dev

# 5. Open browser
# Visit: http://localhost:3000
```

---

## 🐛 Troubleshooting

### **MongoDB Connection Error:**
- **Local:** Ensure MongoDB service is running: `net start MongoDB`
- **Atlas:** Check username, password, and IP whitelist

### **Port Already in Use:**
- Change `PORT=5000` to another port in `.env`
- Update Vite proxy in `client/vite.config.js`

### **Dependencies Issues:**
```powershell
# Clean install
rm -rf node_modules
rm -rf client/node_modules
rm -rf server/node_modules
npm run install-all
```

### **CORS Errors:**
- Ensure backend is running on port 5000
- Check Vite proxy configuration in `client/vite.config.js`

---

## 📚 Available Scripts

### **Root Directory:**
- `npm run dev` - Run both client and server
- `npm run server` - Run server only
- `npm run client` - Run client only
- `npm run install-all` - Install all dependencies

### **Server Directory:**
- `npm start` - Start server (production)
- `npm run dev` - Start server (development with nodemon)

### **Client Directory:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 🎉 You're All Set!

Visit http://localhost:3000 and start exploring RentEase!

**Login with test account:**
- Email: rajesh.owner@example.com
- Password: password123
