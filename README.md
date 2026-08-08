# 🍴 Food Reel

Food Reel is a full-stack social food-sharing platform where users can discover, share, and interact with food content.

The project is designed with a scalable backend architecture using separate services for authentication and user-related functionality.

## 🚀 Features

- 🔐 User authentication and authorization
- 👤 User profiles
- 🍔 Share food content
- ❤️ Like food posts
- 💬 Comment on posts
- 🔖 Bookmark food posts
- 👥 Follow and unfollow users
- 🏠 Personalized food feed
- 📱 Responsive frontend
- 🔒 Protected API routes
- ⚙️ Service-based backend architecture

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- REST APIs

### Architecture

- Microservices architecture
- API Gateway
- Authentication Service
- User Service

### Tools

- Git
- GitHub
- Postman
- VS Code

## 📁 Project Structure

```text
food-reel/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   │
│   ├── api-gateway/
│   │
│   ├── auth-service/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   ├── server.js
│   │   └── package.json
│   │
│   └── user-service/
│
├── .gitignore
└── README.md
