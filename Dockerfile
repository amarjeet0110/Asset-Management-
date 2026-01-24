FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 1337

CMD ["npm", "start"]
```

---

## 🔧 Quick Fix Steps:

### **GitHub Web Interface se:**

1. **GitHub repository** kholo
2. **Dockerfile** file par click karo
3. **Edit button** (pencil icon) click karo
4. **Sab kuch delete karo** aur neeche diya hua **EXACT code** paste karo:
```
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 1337

CMD ["npm", "start"]
```

5. **"Commit changes"** click karo

---

## ⚠️ Important Notes:

- Dockerfile mein **NO backticks** (```)
- Dockerfile mein **NO markdown formatting**
- **Plain text only**
- **No extra spaces** at start/end of file

---

## 📋 Final Check:

Dockerfile ka content exactly aisa hona chahiye (bina kisi extra character ke):
```
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 1337

CMD ["npm", "start"]
