const express = require('express');
const ParseServer = require('parse-server').ParseServer;

const app = express();

// Parse Server Configuration
const api = new ParseServer({
  databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/asset-db',
  cloud: process.env.CLOUD_CODE_MAIN || './cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  javascriptKey: process.env.JAVASCRIPT_KEY || 'myJsKey',
  restAPIKey: process.env.REST_API_KEY || 'myRestKey',
  clientKey: process.env.CLIENT_KEY || 'myClientKey',
  fileKey: process.env.FILE_KEY || 'myFileKey',
  allowClientClassCreation: true,
});

// Serve Parse API on /parse
app.use('/parse', api);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Asset Management Backend is Running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      parse: '/parse',
      health: '/'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Parse-Application-Id, X-Parse-REST-API-Key, X-Parse-Master-Key, X-Parse-Session-Token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const port = process.env.PORT || 1337;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log('=================================');
  console.log('🚀 Parse Server is running!');
  console.log(`📡 Server URL: http://${host}:${port}`);
  console.log(`🔗 Parse endpoint: http://${host}:${port}/parse`);
  console.log(`💚 Health check: http://${host}:${port}/health`);
  console.log('=================================');
});
```

---

### **Step 2: `cloud/main.js` File Banao**

**Folder structure:**
```
📁 cloud/
  📄 main.js
