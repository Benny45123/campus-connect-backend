# 🚀 Campus Connect Backend
### *The high-performance engine powering community collaboration.*

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonecw&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" />
</p>

---

## 🌐 Project Overview
Campus Connect is a modular, scalable backend designed to handle community interactions, article management, and real-time content intelligence. This API is built with a focus on **security**, **speed**, and **automated deployment**.

---

## ✨ Key Features & Technical Highlights

### ⚡ Performance & Scalability
* **Redis Caching:** Integrated caching layers for article search results to minimize database load.
* **Mongoose Lean Queries:** Optimized read operations for faster JSON response times.
* **Cloudinary Storage:** Managed cloud storage for high-resolution article assets.

### 🔐 Security & Intelligence
* **JWT & HttpOnly Cookies:** Secure, persistent authentication flow.
* **Rate Limiting:** Prevents DDoS and brute-force attacks on sensitive auth routes.
* **NLP Tagging:** Automated tag generation using `natural` and `node-rake` for content categorization.

---

## 🚢 DevOps & Deployment Architecture
This project implements a professional-grade **CI/CD Pipeline** to ensure seamless production updates.



### ⚙️ CI/CD Workflow
1.  **Containerization:** The entire backend is wrapped in a multi-stage **Docker** build for environment consistency.
2.  **GitHub Self-Hosted Runner:** Deployment is orchestrated via a self-hosted runner on the **AWS EC2** instance, allowing for secure, internal execution of deployment scripts.
3.  **Automated Pipeline:** On every push to `main`, the runner pulls the latest code, builds the Docker image, and restarts the containerized service.

### 🛠 Production Problem Solving
* **Nginx Reverse Proxy:** Successfully configured Nginx as a reverse proxy to handle **HTTPS/SSL termination**.
* **Proxy Issue Fixes:** Resolved common production "502 Bad Gateway" and header-forwarding issues (e.g., `X-Forwarded-For`) to ensure the backend correctly identifies client IPs behind the proxy.
* **Zero-Downtime Strategy:** Implemented Docker-based restarts to maintain high availability during updates.

---

## 🏗 Modular Structure
```text
├── config/             # Database and Redis configurations
├── controllers/        # Business logic for routes
├── middleware/         # Auth, Rate-limiting, and Error handlers
├── models/             # Mongoose Schemas (User, Article, etc.)
├── routes/             # Express Route definitions
├── utils/              # NLP Tagging and Cloudinary helpers
└── Dockerfile          # Production container configuration
```
# 🚀 Getting Started
### Prerequisites

    Docker & Docker Compose

    Node.js 18+

    Environment Variables (.env)

### Installation & Local Setup

    Clone the repository:
    Bash

    git clone [https://github.com/Benny45123/campus-connect-backend.git](https://github.com/Benny45123/campus-connect-backend.git)
    cd campus-connect-backend

    Run with Docker:
    Bash

    docker compose up --build

    The server will be available at http://localhost:5000

### 🛠 Tech Stack Details

    Runtime: Node.js (Express.js)

    Database: MongoDB Atlas (NoSQL)

    Cache: Redis

    Media: Cloudinary API

    Cloud: AWS EC2 (Ubuntu)

    Proxy: Nginx

    CI/CD: GitHub Actions (Self-Hosted Runner)
