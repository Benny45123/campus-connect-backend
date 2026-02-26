<div align="center">

<br/>

```
 ██████╗ █████╗ ███╗   ███╗██████╗ ██╗   ██╗███████╗
██╔════╝██╔══██╗████╗ ████║██╔══██╗██║   ██║██╔════╝
██║     ███████║██╔████╔██║██████╔╝██║   ██║███████╗
██║     ██╔══██║██║╚██╔╝██║██╔═══╝ ██║   ██║╚════██║
╚██████╗██║  ██║██║ ╚═╝ ██║██║     ╚██████╔╝███████║
 ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚══════╝
       C O N N E C T  —  B A C K E N D  A P I
```

### *The high-performance engine powering community collaboration*

<br/>

![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

<br/>

![Commits](https://img.shields.io/github/commit-activity/t/Benny45123/campus-connect-backend?style=flat-square&color=00d4ff&label=commits)
![Last Commit](https://img.shields.io/github/last-commit/Benny45123/campus-connect-backend?style=flat-square&color=7c3aed)
![Repo Size](https://img.shields.io/github/repo-size/Benny45123/campus-connect-backend?style=flat-square&color=10b981)
![Language](https://img.shields.io/github/languages/top/Benny45123/campus-connect-backend?style=flat-square&color=f59e0b)

<br/>

</div>

---

## 🌐 Overview

**Campus Connect Backend** is a modular, production-ready REST API designed to handle community interactions, article management, and real-time content intelligence. Built with a relentless focus on **security**, **speed**, and **fully automated deployment**.

> *Push to `main`. That's it. The pipeline handles the rest.*

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗 Architecture](#-architecture)
- [🚢 DevOps & CI/CD](#-devops--cicd-pipeline)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [🛠 Tech Stack](#-tech-stack)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### ⚡ Performance & Scalability
| Feature | Detail |
|---|---|
| 🔴 **Redis Caching** | Article search result caching |
| 🍃 **Lean Queries** | Mongoose lean() for fast JSON |
| ☁️ **Cloudinary** | Cloud media storage & delivery |

</td>
<td width="50%">

### 🔐 Security & Intelligence
| Feature | Detail |
|---|---|
| 🔑 **JWT + Cookies** | HttpOnly secure auth flow |
| 🛡 **Rate Limiting** | DDoS & brute-force protection |
| 🧠 **NLP Tagging** | Auto-tags via `natural` + `node-rake` |

</td>
</tr>
</table>

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT REQUEST                        │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              NGINX  (Reverse Proxy + SSL/TLS)                │
│         ✦ SSL Termination   ✦ X-Forwarded-For               │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP (internal)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               DOCKER CONTAINER  :5000                        │
│  ┌──────────┐  ┌───────────┐  ┌─────────┐  ┌───────────┐  │
│  │  Routes  │→ │Controllers│→ │Services │→ │  Models   │  │
│  └──────────┘  └───────────┘  └─────────┘  └─────┬─────┘  │
│                                                    │         │
│  ┌─────────────────────┐   ┌──────────────────┐   │         │
│  │  Redis Cache Layer  │   │  MongoDB Atlas   │ ◄─┘         │
│  └─────────────────────┘   └──────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚢 DevOps & CI/CD Pipeline

```
  Developer                GitHub                  AWS EC2
     │                       │                        │
     │──── git push main ────▶│                        │
     │                       │── trigger workflow ────▶│
     │                       │                        │── pull latest code
     │                       │                        │── docker build
     │                       │                        │── docker compose up
     │                       │◀─── job complete ──────│
     │◀─── ✅ deployed ───────│                        │
```

### ⚙️ Pipeline Steps

**`Step 1` — Containerization**
> The entire backend is wrapped in a **multi-stage Docker** build. Consistent environments from development all the way to production — no configuration drift.

**`Step 2` — Self-Hosted GitHub Runner**
> A self-hosted runner sits directly on the **AWS EC2** instance. Deployment scripts execute internally, keeping secrets and infrastructure fully private.

**`Step 3` — Automated Push-to-Deploy**
> Every push to `main` triggers the pipeline: pull code → rebuild Docker image → restart container. Zero manual SSH required.

**`Step 4` — Production Hardening**
> Nginx acts as a reverse proxy handling **HTTPS/SSL termination**, resolving 502 Bad Gateway errors, and correctly forwarding `X-Forwarded-For` headers for real IP detection behind the proxy.

---

## 📁 Project Structure

```
campus-connect-backend/
│
├── 📁 .github/
│   └── 📁 workflows/          # ⚙️  CI/CD pipeline definitions
│
├── 📁 config/                 # 🔧  DB & Redis connection configs
├── 📁 controllers/            # 🧠  Business logic for each route
├── 📁 middleware/             # 🛡️  Auth, Rate-limiting, Error handlers
├── 📁 models/                 # 📐  Mongoose schemas (User, Article…)
├── 📁 routes/                 # 🗺️  Express route definitions
├── 📁 services/               # ⚡  Core service abstractions
├── 📁 utils/                  # 🔨  NLP tagging & Cloudinary helpers
│
├── 🐳 Dockerfile              # Multi-stage production container
├── ⚙️  app.js                 # Application entry point
├── 🧪 app.test.js             # Test suite
└── 📦 package.json            # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- 🐳 Docker & Docker Compose
- 🟢 Node.js 18+
- 📄 `.env` file configured (see below)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Benny45123/campus-connect-backend.git
cd campus-connect-backend
```

**2. Set up environment variables**

```bash
cp .env.example .env
# Fill in your secrets (MongoDB URI, Redis URL, JWT secret, Cloudinary keys)
```

**3. Run with Docker**

```bash
docker compose up --build
```

> ✅ Server live at **`http://localhost:5000`**

---

## ⚙️ Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/campus-connect

# Cache
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Media
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js 18 + Express.js | HTTP server & routing |
| **Database** | MongoDB Atlas | NoSQL document storage |
| **Cache** | Redis | Search result caching |
| **Media** | Cloudinary API | Image upload & CDN delivery |
| **Auth** | JWT + HttpOnly Cookies | Secure session management |
| **NLP** | `natural` + `node-rake` | Automated content tagging |
| **Cloud** | AWS EC2 (Ubuntu) | Production hosting |
| **Proxy** | Nginx | Reverse proxy + SSL |
| **CI/CD** | GitHub Actions | Automated deployments |
| **Containers** | Docker + Compose | Environment isolation |

---

<div align="center">

### 🔗 Links

[![GitHub Repo](https://img.shields.io/badge/GitHub-campus--connect--backend-181717?style=for-the-badge&logo=github)](https://github.com/Benny45123/campus-connect-backend)

<br/>

*Built with ⚡ by [Benny45123](https://github.com/Benny45123)*

<br/>

```
  ╔═══════════════════════════════╗
  ║  production · secure · fast   ║
  ╚═══════════════════════════════╝
```

</div>
