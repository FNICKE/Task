# 🚀 Backend Developer Internship Assignment

> 🔐 **Secure REST API with Authentication, Role-Based Access & Basic Frontend Integration**
> 🧑‍💻 Completed as part of a **Backend Developer Internship** evaluation

---

## 🛠️ Tech Stack

✨ **Modern, Production‑Ready Stack**

* 🟢 **Backend**: Node.js, Express
* 🗄️ **Database**: MySQL 
* 🔑 **Authentication**: JWT, bcrypt
* 🎨 **Frontend**: React + Vite
* ☁️ **Deployment**: Render (Backend), Netlify (Frontend)

---

## 🔗 Live Links 🌍

* 🖥️ **Deployed Link**: [https://tasknew1.netlify.app/login](https://tasknew1.netlify.app/login)

---

## 📌 Assignment Overview

🎯 **Goal**: Build a **scalable and secure REST API** with authentication & role‑based access control, along with a **basic frontend UI** to demonstrate API interaction.

⏱️ **Expected Time**: 2–3 days
🎯 **Primary Focus**: Backend Development
🎨 **Secondary Focus**: Frontend Integration

---

## ✅ Core Features Implemented

### 🔧 Backend (Primary Focus)

* 👤 User **registration & login** with bcrypt password hashing
* 🔐 **JWT‑based authentication**
* 🛡️ **Role‑Based Access Control (RBAC)**: `user` & `admin`
* 🔒 Protected routes using custom middleware:

  * `protect` → JWT verification
  * `adminOnly` → Admin‑only access
* 📋 Admin‑only endpoint to fetch all users
* 🧪 Input validation with meaningful HTTP status codes
* 🧩 Modular architecture (controllers, routes, middleware)
* 🌐 RESTful API design (versioning‑ready)
* 📑 API documentation via README & Postman
* ⚡ **MySQL connection pooling** using `mysql2`

---

### 🎨 Basic Frontend (Supportive)

* ⚛️ Built using **React + Vite**
* 📄 Features:

  * 📝 User Registration
  * 🔑 Login
  * 🔐 Protected Dashboard (JWT required)
  * 🔄 Role‑based redirection:

    * 👑 Admin → Admin Panel
    * 👤 User → User Dashboard
* 💬 Displays API success & error messages
* 💾 JWT persistence via `localStorage / sessionStorage`

---

## 🔐 Security & Scalability Practices

* 🔑 Secure JWT signing with strong secret
* 🔒 Password hashing using bcrypt
* 🧼 Input sanitization & validation
* 🧯 Centralized error handling
* 🌍 CORS configured for frontend domain
* ⚙️ Database connection pooling for scalability
* 🚀 Production‑ready deployment on Render & Netlify

---

## 🗄️ Database Design

🛢️ **Database**: MySQL (Railway)

### 📄 Users Table Schema

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Quick Setup (Local Development)

### 🔙 Backend Setup

```bash
cd backend
npm install
```

#### 📄 `.env` Example

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=your_db_name
JWT_SECRET=super-long-secret-key-change-this
JWT_EXPIRES_IN=7d
```

▶️ **Start Backend Server**

```bash
npm run dev
```

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
```

▶️ **Start Frontend Server**

```bash
npm run dev
```

🌐 Open browser: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 API Documentation

| 🔧 Method | 🌐 Endpoint          | 📖 Description              | 🔐 Auth |
| --------- | -------------------- | --------------------------- | ------- |
| POST      | `/api/auth/register` | Register new user           | ❌       |
| POST      | `/api/auth/login`    | Login & receive JWT         | ❌       |
| GET       | `/api/auth/me`       | Get logged‑in user info     | ✅       |
| GET       | `/api/admin/users`   | List all users (Admin only) | ✅ Admin |

📮 **Postman collection available on request**

---

## 🏆 Evaluation Criteria Mapping

| 🎯 Criteria          | ✅ Implementation                                |
| -------------------- | ----------------------------------------------- |
| API Design           | RESTful routes, proper HTTP status codes        |
| Database Management  | MySQL schema, unique email, role enum           |
| Security             | JWT auth, bcrypt hashing, middleware protection |
| Frontend Integration | React UI consuming APIs via Axios               |
| Scalability          | Connection pooling, modular structure           |
| Deployment           | Render (Backend) + Netlify (Frontend)           |

---

## ❤️ Submission Note

✨ Assignment submitted with **best practices**, **clean architecture**, and **security‑first mindset**.

🙏 Thank you for reviewing my Backend Internship Assignment.

🚀 **Open to feedback and excited to contribute to your team!**

---

🌟 **Ready to Contribute. Let’s Build Something Great!**
