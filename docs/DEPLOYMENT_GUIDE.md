# RainAksh Network — Complete Deployment Guide

This guide details how to build and deploy the **RainAksh Network** web application from this GitHub repository to popular hosting environments.

---

## 🌐 Official URLs

- **Live Application:** [https://ais-pre-jygv4b5u3735vcr73c65mx-933559967706.asia-southeast1.run.app](https://ais-pre-jygv4b5u3735vcr73c65mx-933559967706.asia-southeast1.run.app)
- **Dev Sandbox:** [https://ais-dev-jygv4b5u3735vcr73c65mx-933559967706.asia-southeast1.run.app](https://ais-dev-jygv4b5u3735vcr73c65mx-933559967706.asia-southeast1.run.app)

---

## 📋 Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher
- **Firebase Project:** Firestore database initialized with rules from `firestore.rules`

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for fast SPA hosting)

1. Fork or push this repository to your GitHub account.
2. Sign in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your `rainaksh-network` repository.
4. Framework Preset will auto-detect as **Vite**.
5. Build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **Deploy**. Vercel will build and provision an SSL-secured custom domain in under 60 seconds.

---

### Option 2: Netlify

1. Go to [Netlify](https://www.netlify.com) and select **"Add new site" -> "Import an existing project"**.
2. Connect your GitHub repository.
3. Configure the build parameters:
   - **Base directory:** Leave blank (root)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add a `public/_redirects` file with content: `/*  /index.html  200` to support client-side routing.
5. Click **Deploy site**.

---

### Option 3: Docker / Container Deployment (Google Cloud Run / AWS ECS)

Create a `Dockerfile` in the root:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t rainaksh-network:latest .
docker run -p 8080:80 rainaksh-network:latest
```

---

## 🔑 Master Security & Control Panel

- **Control Panel Route:** Click the **Control Panel** button in the header navigation or bottom navigation dock.
- **Passcode Authentication:** Enter the Master Administrator passcode to gain access to all user form responses, passwords, audit logs, transaction approvals, and CMS controls.

---

## 💬 Contact & Technical Inquiries

- **Lead Architect:** Vikas Kumar
- **Telegram:** [@rainaksh](https://t.me/rainaksh)
- **Email:** [accaiwork@gmail.com](mailto:accaiwork@gmail.com)
- **Payment UPI Desk:** `8877490845@spicepay`
