# Placement Management System (PMS) - Project Architecture

This document provides a detailed overview of the Placement Management System's architecture, including the UI stack, backend structure, database schema, and the overall data flow between the frontend and backend.

---

## 1. Technology Stack Overview

**Frontend (Client-side):**
- **Framework:** React 19 with Vite (fast build tool)
- **Styling:** Tailwind CSS (utility-first CSS framework), Framer Motion (for animations)
- **Routing:** React Router DOM (v7)
- **Icons & Charts:** React Icons, Recharts

**Backend (Server-side):**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs for password hashing
- **File Uploads:** Multer (handling resumes, profile pictures)
- **Email Service:** Nodemailer (for OTP, notifications)

---

## 2. Frontend Architecture & UI

The frontend is located in the `src` directory and follows a component-based architecture logically grouped by features and user roles.

### 2.1 File Structure
- `src/App.jsx`: The main entry point for routing. Defines all Public Routes and Protected Routes based on user roles (`student`, `company`, `admin`).
- `src/components/`: Houses all the React components, categorized into subdirectories:
  - `/auth`: Login, Registration, OTP Verification, Forgot Password.
  - `/admin`: Admin dashboards, company/student management, analytics, system reports.
  - `/company`: Company portal for posting jobs, reviewing applicants, scheduling interviews.
  - `/dashboard`: Student portal for profile setup, applying to jobs, tracking applications, taking practice tests.
  - *Root components*: Shared UI like `Navbar`, `Footer`, `Hero`, `Features` for the public landing page.

### 2.2 UI State & Rendering
- State management across components relies on React's built-in hooks (`useState`, `useEffect`, `Context API`).
- Data is dynamically fetched from backend API endpoints and rendered using Tailwind CSS for responsive layouts and Recharts for analytical dashboards (like Admin and Company analytics).
- `framer-motion` is utilized to add smooth transitions and micro-animations to enhance the User Experience (UX).

---

## 3. Backend Architecture & API

The backend resides in the `server` directory and is built to serve RESTful API endpoints consumed by the React UI.

### 3.1 File Structure
- `server/server.js`: The application entry point. Sets up Express, connects to MongoDB, configures CORS, serves static files (`/uploads`), and registers route handlers.
- `server/routes/`: Defines API endpoints (e.g., `/api/auth`, `/api/student`, `/api/company`, `/api/admin`, `/api/notifications`, `/api/messages`).
- `server/controllers/`: Contains the business logic for each route. For example, validating login credentials, creating job posts, or retrieving metrics.
- `server/middleware/`: Handles request interception (e.g., authentication checks verifying JWTs via HTTP headers, handling file uploads with Multer).
- `server/config/db.js`: Establishes the connection to the MongoDB cluster.

---

## 4. Data Storage (MongoDB Schemas)

Data is modeled using Mongoose and stored in MongoDB. The schemas define relationship constraints to maintain data integrity. The primary models include:

- **User Model (`User.js`):** The base model for all accounts handling authentication credentials (email, password hash, role).
- **Student Model (`Student.js`):** Linked to `User` (1-to-1). Stores personal info, academic details (CGPA, 10th/12th marks), skills, and an array of `Application` references.
- **Company Model (`Company.js`):** Linked to `User`. Stores company profile, website, industry type, and contact details.
- **Job Model (`Job.js`):** Created by companies. Contains job title, description, required CGPA, eligible branches, skills, salary, and references to `Application` documents submitted by students.
- **Application Model (`Application.js`):** The junction connecting a `Student` to a `Job`. Tracks the status of the application (e.g., applied, shortlisted, interviewed, hired).
- **Other Models:** `Interview`, `Message`, `Notification`, `PlacementReport`, and `Resume` (for storing Multer-uploaded file paths).

---

## 5. End-to-End Data Flow

Here is the step-by-step flow of how data moves from the database to the UI:

### 5.1 Registration & Authentication Flow
1. **Frontend:** The user fills out the registration form in `Register.jsx`. React captures the state.
2. **API Request:** An HTTP POST request is sent to `/api/auth/register` containing user details.
3. **Backend Logic:** The `authController` hashes the password and saves a new `User` document to MongoDB. Nodemailer sends an OTP for email validation.
4. **Authentication:** Upon login (or active session), the backend validates credentials and issues a JWT token.
5. **Frontend State:** The token is stored locally in the browser. The user is redirected to the appropriate dashboard based on their role using `ProtectedRoute` wrappers in `App.jsx`.

### 5.2 Content Rendering (e.g., Viewing Job Listings)
1. **Frontend:** A student navigates to `JobsPage.jsx`.
2. **Component Mount:** A React `useEffect` hook triggers a `fetch` or `axios.get` call to `/api/student/jobs`.
3. **Backend Middleware:** The request goes through auth middleware to verify the JWT token included in the request headers.
4. **Backend Database Query:** The controller queries `Job.find({ status: 'open' })`, potentially filtering by the student's eligibility (matching CGPA/branch requirements), and returns the results as JSON.
5. **Frontend Update:** The React component updates its state with the received JSON payload.
6. **UI Rendering:** The UI iterates through the jobs array, displaying job cards styled with Tailwind CSS properties.

### 5.3 Data Submission (e.g., Applying for a Job)
1. **Frontend:** The user clicks "Apply" on a job card.
2. **API Request:** A POST request to `/api/student/apply/:jobId` is sent.
3. **Backend Write:** The controller verifies existing applications to prevent duplicates, creates a new `Application` document, and pushes its ID to the `Job`'s and `Student`'s application arrays in MongoDB.
4. **Feedback:** A success response triggers a UI toast notification (e.g., "Successfully Applied!") and updates the local state to show the button as "Applied".
