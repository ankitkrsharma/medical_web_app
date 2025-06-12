# Medical Web App - Lung Cancer Prediction System

A full-stack web application designed for doctors to securely manage patient data and perform lung scan predictions using machine learning. It features a seamless interface for authentication, patient management, scan uploads, and AI-based result visualization.

---

##  Features

- **Doctor Authentication**
  - Secure login/signup using JWT tokens
  - Passwords encrypted with `bcrypt`
  
- **Patient Management**
  - Add and manage multiple patients per doctor
  - View all scans and predictions for each patient

- **Lung Scan Upload**
  - Upload `.jpg` or `.png` X-ray or CT scan images
  - Backend validation using `multer` to prevent unwanted files

- **AI Prediction**
  - Integrated ML model via Flask backend
  - Predicts cancer presence and returns confidence score

- **Modern UI**
  - Clean dashboard with modal popups and interactive patient selection
  - Real-time scan results shown with clear messages

---

##  Tech Stack

| Layer        | Technology Used                                 |
|--------------|-------------------------------------------------|
| Frontend     | HTML, CSS, JavaScript (Vanilla), Flask (UI)     |
| Backend API  | Node.js, Express.js, Sequelize ORM              |
| Auth & JWT   | bcrypt, jsonwebtoken                            |
| Database     | MySQL (Relational), Sequelize associations      |
| File Upload  | multer (with filters & disk storage)            |
| ML Model     | Python, Flask, TensorFlow/Keras                 |

---

##  Folder Structure
```medical_web_app/
├── backend/
│ ├── src/
│ │ ├── routes/ # API route handlers
│ │ ├── models/ # Sequelize models & associations
│ │ ├── middleware/ # JWT auth, upload config
│ │ └── utils/ # JWT creation, multer config
├── frontend/
│ ├── templates/ # Flask-rendered HTML views
│ ├── static/ # CSS and JS files
│ └── app.py # Flask app acting as frontend
└── uploads/ # Uploaded scan image storage
```

---

## Authentication

- **JWT-based**: Each login generates a JWT stored in `sessionStorage`
- Protected routes on backend validate token and extract doctor ID
- Doctors cannot access data from other doctors

---

##  Prediction Flow

1. Doctor selects a patient
2. Uploads a lung scan via dashboard
3. Scan stored in `/uploads`, ID saved in DB
4. Flask model receives scan ID → loads image → returns prediction
5. Prediction result displayed with confidence

---

## 🛡 Security & Validation

- Only `jpg/png` images allowed via multer filters
- Patient and scan access is scoped to logged-in doctor
- Invalid JWTs return `401 Unauthorized`
- CSRF protected by secure routing design (no form submission abuse)

---

##  Deployment Ready

- `.env` config with DB and JWT secret (not uploaded for security concerns, can be generated for every user)
- Compatible with:
  - Railway / Render (backend & DB)
  - Netlify / Vercel (if Flask replaced with React)
  - PlanetScale or Neon for managed MySQL

---

## 🧠 Future Enhancements

- Dockerized microservices (Frontend / Backend / ML)
- Model retraining with improved dataset
- Admin panel for hospital-wide analytics
- Patient report downloads as PDF


## 🤝 Contributors

- **Ankit Kr Sharma** – Full Stack Developer  

---




