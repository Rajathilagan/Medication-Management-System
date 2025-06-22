# 💊 Meds Buddy - Medication Management System

Meds Buddy is a role-based web application that helps patients track their medications and allows caretakers to monitor adherence. Built with **React**, **Node.js**, **Express**, and **SQLite**.

## 🚀 Features

### 👩‍⚕️ For Patients:
- Login and secure authentication
- View assigned medications
- Mark medications as taken (only for today's date)
- Visual calendar showing taken, missed, and today's medications
- Adherence progress view (percentage)

### 🧑‍⚕️ For Caretakers:
- Add, edit, delete medications for patients
- View patient adherence summary
- Dashboard showing:
  - Adherence percentage
  - Taken this month
  - Missed this month
  - Remaining this month
- View recent medication logs and calendar

## 🔐 Authentication
- Cookie-based secure login with JWT
- Role-based access control for routes (`patient` vs `caretaker`)

## 🛠️ Tech Stack

- **Frontend**: React, Axios, React Router DOM, CSS
- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Authentication**: JWT with `httpOnly` cookies

---

## Patient email and password

 email: siva@example.com
 password: 123456

## Caretaker email and password

 email: raj@example.com
 password: 123456
