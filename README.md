# 🚀 Full Stack Microservices Architecture

This project demonstrates a full-stack microservices system built using:

🔹 Spring Boot Microservices  
🔹 OpenFeign for Service Communication  
🔹 Separate Databases per Service  
🔹 React Frontend for UI  
🔹 REST-based synchronous communication  
🔹 Designed for future Kafka + Eureka integration  

---

## 📌 Project Overview

This system consists of:

### Backend Microservices:
1. User Service
2. Order Service

### Frontend:
3. React Application (UI Layer)

Each backend service:
- Runs independently
- Has its own database
- Communicates using OpenFeign
- Can be deployed separately

Frontend communicates with backend services via REST APIs.

---

## 🏗️ System Architecture

Frontend (React - 3000)
        ↓
Order Service (8082)
        ↓
OpenFeign
        ↓
User Service (8081)

---

## 🟢 User Service

### Responsibilities
- Create User
- Fetch User by ID
- Manage User Data

### Endpoints

Create User:
POST /users

Get User:
GET /users/{id}

Runs on:
http://localhost:8081

---

## 🔵 Order Service

### Responsibilities
- Create Order
- Validate User before placing order
- Communicate with User Service via Feign

### Endpoint

Create Order:
POST /orders

Runs on:
http://localhost:8082

---

## ⚛️ React Frontend

### Responsibilities
- User Registration Form
- Order Creation Form
- Display API Responses
- Basic error handling
- Clean UI representation

Runs on:
http://localhost:3000

### Tech Used:
- React
- Axios
- Functional Components
- Hooks (useState, useEffect)
- CSS / Tailwind (if used)

---

## 🔄 Service Communication

Order Service uses OpenFeign:

```java
@FeignClient(name = "user-service", url = "http://localhost:8081")
public interface UserClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable("id") Long id);
}
