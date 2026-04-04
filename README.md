# 🚗 RideShare Application

A full-stack ride-sharing platform where users can create, join, and manage rides, and drivers can accept and complete rides with real-time notifications and wallet-based payments.

---

## 📌 Features

### 👤 User Features

* Register & Login
* Create Ride
* Search & Join Ride
* Request-based ride approval system
* Wallet system (add money, transactions)
* Ride history tracking
* Real-time notifications

---

### 🚗 Driver Features

* Register as Driver (with vehicle details)
* Accept ride requests
* Ride lifecycle:

  * Accept Ride
  * Arrived
  * Start Ride
  * Complete Ride
* Active ride tracking (dashboard access)

---

### 💰 Payment System

* Wallet-based payment system
* Automatic fare split among participants
* Driver receives total fare after completion
* Transaction history maintained

---

### 🔔 Notification System

* Real-time notifications (polling-based)
* Sidebar notification UI
* Covers:

  * Join requests
  * Request accepted/rejected
  * Driver accepted ride
  * Driver arrived
  * Ride started
  * Ride completed

---

### 🤖 Smart Features

* AI-based ride suggestion
* Smart ride search ranking
* Distance-based fare calculation (Map API)

---

## 🛠️ Tech Stack

### Backend

* Java (Spring Boot)
* Spring Data JPA
* MySQL Database

### Frontend

* React.js
* Fetch API
* CSS (custom styling)

### APIs Used

* OpenStreetMap (distance calculation)
* Gemini API (AI suggestions)

---

## 📂 Project Structure

```
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
```

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

1. Open backend project
2. Configure database in `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/rideshare_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

3. Run Spring Boot application

---

### 🔹 Frontend Setup

1. Navigate to frontend folder

```
cd rideshare-frontend
```

2. Install dependencies

```
npm install
```

3. Start React app

```
npm start
```

---

## 🔄 API Base URL

```
http://localhost:8080
```

---

## 🚀 Key Functional Flow

1. User creates ride
2. Other users send join requests
3. Host accepts/rejects requests
4. Driver accepts ride
5. Driver arrives → starts → completes ride
6. Payment processed automatically
7. Notifications sent at every step

---

## ⚠️ Known Limitations

* Uses polling instead of real-time sockets
* Basic UI (can be improved)
* No authentication token (JWT) yet

---

## 📈 Future Improvements

* Real-time updates using WebSockets
* Google Maps live tracking
* Razorpay payment integration
* Push notifications
* Admin dashboard

---

## 👨‍💻 Author

Developed by **Yash Dabhekar**

---

## ⭐ Final Note

This project demonstrates full-stack development with real-world features like ride management, payments, notifications, and AI integration.

---
