# 🏢 Asset Management System

A modern, aesthetic asset management system built with HTML, CSS, JavaScript, and Flask (Python).

## ✨ Features

- ✅ Add, Edit, Delete Assets
- 🔍 Search and Filter Functionality
- 📊 Real-time Statistics Dashboard
- 💰 Asset Value Tracking
- 📍 Location Management
- 👤 Assignment Tracking
- 🎨 Beautiful Dark Theme UI
- 📱 Fully Responsive Design
- 💾 Backend API with Flask
- 🚀 Easy Deployment

## 📁 Project Structure

```
asset-management/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # Frontend JavaScript
├── app.py              # Flask Backend
├── requirements.txt    # Python dependencies
├── assets.json         # Data storage (auto-created)
└── README.md          # This file
```

## 🚀 Quick Start (Without Backend)

1. Simply open `index.html` in your browser
2. Start adding assets!
3. Data is saved in browser's localStorage

## 🔧 Setup with Backend

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation Steps

1. **Clone or download all files to a folder**

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask backend:**
   ```bash
   python app.py
   ```

4. **Enable backend in frontend:**
   - Open `script.js`
   - Change line 3: `const USE_BACKEND = true;`

5. **Open your browser:**
   - Go to `http://localhost:5000`

## 🌐 Deployment Options

### Option 1: Deploy to Render.com (Recommended - FREE)

1. **Create account on [Render.com](https://render.com)**

2. **Create a new Web Service:**
   - Connect your GitHub repository
   - Or upload your files

3. **Configure:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Environment:** Python 3

4. **Deploy!** Render will give you a URL like `https://your-app.onrender.com`

### Option 2: Deploy to Railway.app (FREE)

1. **Create account on [Railway.app](https://railway.app)**

2. **Click "New Project" → "Deploy from GitHub"**

3. **Select your repository**

4. **Railway auto-detects Python and deploys!**

### Option 3: Deploy to PythonAnywhere (FREE)

1. **Create account on [PythonAnywhere.com](https://www.pythonanywhere.com)**

2. **Upload files via Files tab**

3. **Create a new web app (Flask)**

4. **Configure WSGI file to point to your app.py**

5. **Reload the web app**

### Option 4: Deploy to Heroku

1. **Create `Procfile`:**
   ```
   web: gunicorn app:app
   ```

2. **Create `runtime.txt`:**
   ```
   python-3.11.0
   ```

3. **Deploy:**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## 🎨 Customization

### Change Colors
Edit `styles.css` - Main colors are:
- Primary: `#00d9ff` (Cyan)
- Background: `#0f2027` to `#2c5364` (Dark gradient)
- Accent: `#00d9ff`

### Change Backend URL
Edit `script.js` line 2:
```javascript
const API_URL = 'https://your-backend-url.com/api';
```

## 📊 API Endpoints

- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get single asset
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/stats` - Get statistics
- `GET /api/health` - Health check

## 🐛 Troubleshooting

**Assets not saving?**
- Check if backend is running (`python app.py`)
- Check browser console for errors
- Ensure `USE_BACKEND` is set correctly in `script.js`

**CORS errors?**
- Make sure `flask-cors` is installed
- Check if backend URL is correct

**Port already in use?**
- Change port in `app.py`: `port = int(os.environ.get('PORT', 8000))`

## 👤 Developer

**Developed by [Amarjeet](https://amarjeet-portfolio-mu.vercel.app/)**

## 📝 License

Free to use for personal and commercial projects.

## 🤝 Support

For issues or questions, contact through the portfolio website.

---

**Happy Asset Managing! 🎉**
