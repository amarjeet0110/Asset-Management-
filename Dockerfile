
# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Expose port
EXPOSE 1337

# Start the application
CMD ["npm", "start"]
```

---

## 2️⃣ `.dockerignore`
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
