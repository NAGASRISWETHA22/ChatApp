# 💬 Real-Time Group Chat App

A Messenger-style real-time group chat built with React, Spring Boot, WebSocket (SockJS + STOMP), and MySQL.

---

## 📁 Project Structure

```
chat-project/
├── chat-backend/     ← Spring Boot (Java 17, Maven)
└── chat-frontend/    ← React (CRA)
```

---

## ⚙️ Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

---

## 🗄️ Database Setup

Start MySQL and run:

```sql
CREATE DATABASE chatdb;
```

Spring Boot will auto-create the `messages` table on first run.

---

## 🚀 Backend Setup

1. Open `chat-backend/src/main/resources/application.properties`
2. Update your MySQL credentials:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

3. Run the backend:

```bash
cd chat-backend
./mvnw spring-boot:run
```

Backend starts on → **http://localhost:8080**

---

## ⚛️ Frontend Setup

```bash
cd chat-frontend
npm install
npm start
```

Frontend starts on → **http://localhost:3000**

---

## 🧪 Testing Real-Time Chat

1. Open **two browser tabs** at `http://localhost:3000`
2. In Tab 1 — select **Alice** from the dropdown, type a message and send
3. In Tab 2 — select **Bob**, reply — both tabs update instantly in real-time!

---

## 🔌 How It Works

```
React (SockJS/STOMP)
    ↓  /app/chat.send
Spring Boot WebSocket
    ↓  saves to MySQL
    ↓  broadcasts to /topic/messages
All connected clients update instantly
```

---

## 👥 Users

Default users in the dropdown: **Alice, Bob, Carol, David, Eva**

To add/remove users, edit the `USERS` array in:
`chat-frontend/src/components/MessageInput.js`

---

## 📡 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/messages` | Load all chat history |
| WS | `/ws` | WebSocket connection (SockJS) |
| WS SEND | `/app/chat.send` | Send a message |
| WS SUB | `/topic/messages` | Subscribe for new messages |
