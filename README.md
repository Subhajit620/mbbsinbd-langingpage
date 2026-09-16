# MBBS in Bangladesh - Aspiring Life Admissions Portal

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed for MBBS admission counseling and eligibility verification for Bangladesh medical colleges under DGHS guidelines.

---

## Features

- **Interactive 2-Step Eligibility Calculator**: Equivalence grading calculation for Class 10 (SSC) and Class 12 (HSC) on Bangladesh 5.00 GPA scale.
- **Automated PDF Dossier Generator**: Server-side branded PDF reports generated dynamically via PDFKit.
- **Automated Email Notifications**: Asynchronous email delivery with PDF dossier attachment.
- **Admin CRM & Analytics Dashboard**: Lead management, search, filters, pagination, CSV export, and email resend.
- **ChatGPT / OpenAI Measurement Pixel**: Integrated oaiq conversion tracking for lead_created events.

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios, CSS3
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, Nodemailer, PDFKit, JWT
- **Tracking**: OpenAI / ChatGPT Ads Pixel SDK (oaiq)

---

## Getting Started

### 1. Backend Setup
`ash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, SMTP credentials in .env
npm run dev
`

### 2. Frontend Setup
`ash
cd client
npm install
npm run dev
`

Open [http://localhost:5173](http://localhost:5173) in your browser.
