# 🚗 RideShare – Full Stack Ride Sharing Platform

A scalable full-stack ride-sharing platform that enables users to create, join, and manage rides, while drivers can accept and complete rides with a complete lifecycle system, wallet-based payments, and intelligent ride suggestions.

---

# 🌟 Highlights

- Real-world ride booking workflow  
- Role-based system (User & Driver)  
- Wallet-based payment system  
- AI-powered ride suggestions  
- Clean modular backend architecture  
- Production-style project structure  

---

# ✨ Features

## 👤 User Module

- User Registration & Login  
- Create and manage rides  
- Search rides with smart ranking  
- Send join requests  
- Host approval system (accept/reject requests)  
- Wallet system:
  - Add money  
  - Automatic fare deduction  
  - Transaction history  
- View ride history  
- Real-time notifications  

---

## 🚗 Driver Module

- Register as driver with vehicle details  
- Accept or reject rides  
- Ride lifecycle management:
  - Accept Ride  
  - Arrived  
  - Start Ride  
  - Complete Ride  
- Active ride dashboard  

---

## 💰 Payment & Wallet System

- Integrated wallet-based payment  
- Automatic fare splitting among passengers  
- Driver receives total fare after ride completion  
- Transaction history maintained  

---

## 🔔 Notification System

- Polling-based real-time notifications  
- Covers:
  - Join requests  
  - Request approval/rejection  
  - Driver actions (accepted, arrived, started, completed)  

---

## 🤖 Smart Features

- AI-based ride suggestions (Gemini API)  
- Smart ride search ranking  
- Distance-based fare calculation using OpenStreetMap  

---

# 🛠️ Tech Stack

## Backend
- Java  
- Spring Boot  
- Spring Data JPA  
- MySQL  

## Frontend
- React.js  
- Fetch API  
- Custom CSS  

## APIs Used
- OpenStreetMap (distance calculation)  
- Gemini API (AI suggestions)  

---

# 📂 Project Structure


rideshare-backend/
└── src/main/java/com/rideshare/rideshare/
├── controller
├── service
├── repository
├── model
├── dto
└── exception

rideshare-frontend/
└── src/
├── components
├── pages
├── styles
└── App.js


---

# ⚙️ Setup Instructions

## 🔹 Backend Setup

1. Open backend project  
2. Configure database in `application.properties`:


spring.datasource.url=jdbc:mysql://localhost:3306/rideshare_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update


3. Run Spring Boot application  

---

## 🔹 Frontend Setup

1. Navigate to frontend folder  


cd rideshare-frontend


2. Install dependencies  


npm install


3. Start React app  


npm start


---

# 🔄 API Base URL


http://localhost:8080


---

# 🚀 System Workflow

1. User creates ride  
2. Other users send join requests  
3. Host accepts/rejects requests  
4. Driver accepts ride  
5. Driver arrives → starts → completes ride  
6. Payment processed automatically  
7. Notifications triggered at every step  

---

# ⚠️ Current Limitations

- Uses polling instead of WebSockets  
- Basic UI (can be enhanced)  
- No JWT authentication (planned)  

---

# 📈 Future Enhancements

- JWT-based authentication & authorization  
- WebSocket real-time updates  
- Live ride tracking with maps  
- Razorpay payment integration  
- Push notifications  
- Admin dashboard  

---

# 👨‍💻 Author

Developed by **Yash Dabhekar**

---

# ⭐ Final Note

This project demonstrates strong full-stack development skills with real-world features like ride lifecycle management, wallet-based payments, notifications, and AI integration.
