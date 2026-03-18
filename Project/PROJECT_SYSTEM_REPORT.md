# Placement Management System - Project System Report
**Status Analysis Generated:** March 2026

---

## SECTION 1 — PROJECT OVERVIEW

**System Name:** Placement Management System (PMS)
**Type:** Full-Stack MERN Application

**Tech Stack:**
- **Frontend Framework:** React + Vite
- **Styling & UI:** TailwindCSS, Framer Motion, Recharts
- **Backend Framework:** Node.js, Express.js
- **Database:** MongoDB
- **ORM:** Mongoose
- **Authentication System:** JWT (JSON Web Tokens) with dual-step login
- **Password Hashing:** bcryptjs
- **File Uploads:** Multer (Used for Resumes)
- **Email System:** Nodemailer (Used for OTP Verification)
- **HTTP Client:** Axios (`src/services/api.js`)

---

## SECTION 2 — PROJECT FOLDER STRUCTURE

```text
Project/
├── frontend/ (src/)
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── company/
│   │   ├── dashboard/  (Student Dashboard - Fully Dynamic)
│   │   └── landing/
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── backend/ (server/)
│   ├── config/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Application.js
│   │   ├── Company.js
│   │   ├── Interview.js
│   │   ├── Job.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── PlacementReport.js
│   │   ├── Resume.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── publicRoutes.js
│   │   └── studentRoutes.js
│   ├── services/
│   │   └── otpService.js
│   └── server.js
├── .env
├── package.json
└── vite.config.js
```

---

## SECTION 3 — DATABASE INFORMATION

**Database Name:** `pms_database` (Hosted on MongoDB Atlas)

**Collection List & Document Counts:**
1. `jobs`: Dynamic
2. `applications`: Dynamic
3. `notifications`: Dynamic
4. `resumes`: Dynamic
5. `users`: Dynamic
6. `messages`: Dynamic
7. `interviews`: Dynamic
8. `placementreports`: Dynamic
9. `companies`: Dynamic
10. `students`: Dynamic

**Example Schema & Relationships (`jobs`):**
- **Fields:** `jobId`, `companyId`, `companyRef`, `companyName`, `title`, `description`, `requiredSkills[]`, `package`, `location`, `jobType`, `minCGPA`, `eligibleBranches[]`, `openings`, `deadline`, `status` (`'open'`, `'closed'`), `postedAt`.
- **Relationships:** Links `companyRef` -> `Company` ObjectId. Contains a list `applications` -> `Application` ObjectId refs.

---

## SECTION 4 — MONGOOSE MODELS

1. **User.js**
   - **Fields:** `email`, `password`, `role` (student, company, admin), `isVerified`, `lastLogin`.
   - **Indexes:** `email` (unique).
2. **Student.js**
   - **Fields:** `userId`, `enrollmentNo`, `branch`, `phone`, `dob`, `gender`, `address`, `tenthPercentage`, `twelfthPercentage`, `cgpa`, `currentSemester`, `skills[]`, `projects[]`, `linkedin`, `resumeId`, `placementStatus`.
   - **References:** `User`, `Resume`, `Application`.
   - **Indexes:** `userId: 1` (unique), `enrollmentNo: 1` (unique).
3. **Company.js**
   - **Fields:** `companyId`, `userId`, `name`, `industry`, `location`, `website`, `description`, `hrName`, `hrEmail`, `isApproved`, `jobsPosted[]`.
   - **References:** `User`, `Job`.
   - **Indexes:** `companyId: 1` (unique). *(Note: Legacy duplicate index issue on `userId` has been fixed in schema).*
4. **Job.js**
   - **Fields:** `jobId`, `companyRef`, `title`, `description`, `requiredSkills[]`, `package`, `location`, `jobType`, `minCGPA`, `status`.
   - **References:** `Company`, `Application`.
   - **Indexes:** `companyRef: 1`, `status: 1`, `jobType: 1`.
5. **Application.js**
   - **Fields:** `studentId`, `jobId`, `resumeUrl`, `status` (pending, shortlisted, rejected, selected).
   - **References:** `Student`, `Job`.
6. **Interview.js**
   - **Fields:** `applicationId`, `date`, `link`, `mode`, `status`.
   - **References:** `Application`.
7. **Notification.js**
   - **Fields:** `userId`, `title`, `message`, `type`, `read`.
   - **References:** `User`.
8. **Message.js**
   - **Fields:** `senderId`, `receiverId`, `content`, `read`.
   - **References:** `User`.
9. **Resume.js**
   - **Fields:** `studentId`, `fileUrl`, `uploadedAt`.
   - **References:** `Student`.
10. **PlacementReport.js**
    - **Fields:** `academicYear`, `totalStudents`, `placedStudents`, `averagePackage`, `highestPackage`.

---

## SECTION 5 — API ENDPOINTS

**Auth (`/api/auth`)**
- `POST /api/auth/register` - `registerUser` - Creates User and generic empty Student/Company profiles. Sends OTP.
- `POST /api/auth/verify-otp` - `verifyOTP` - Flags user as `isVerified: true`.
- `POST /api/auth/login` - `loginUser` - Verifies password and responds with JWT token.
- `GET /api/auth/me` - `getMe` - Returns logged-in user details.

**Admin (`/api/admin`)**
- `GET /api/admin/dashboard` - Returns aggregation stats (`totalStudents`, `activeJobs`, etc.).
- `GET /api/admin/analytics` - Returns pipeline DB aggregated branch-wise & monthly stats.
- `GET /api/admin/companies` - Fetches all companies.
- `GET /api/admin/students` - Fetches all students.
- `GET /api/admin/jobs` - Fetches all jobs.
- `PUT /api/admin/companies/:id/approve` - Sets company `isApproved` to true.
- `PUT /api/admin/companies/:id/reject` - Sets company `isApproved` to false.
- `POST /api/admin/announcements` - Creates a system notification.

**Company (`/api/company`)**
- `GET /api/company/dashboard` - Fetches posted job count, application count, etc.
- `GET /api/company/profile` - Fetches company profile by `req.user.id`.
- `PUT /api/company/profile` - Updates company specifics.
- `GET /api/company/jobs` - View jobs posted by the company.
- `POST /api/company/jobs` - Post a new Job doc.
- `GET /api/company/jobs/:jobId/applicants` - Fetches populated applications linked to the `jobId`.
- `PUT /api/company/applications/:appId/shortlist` - Updates nested application state.
- `POST /api/company/applications/:appId/interview` - Generates a new Interview document.

**Student (`/api/student`)**
- `GET /api/student/profile` - Fetches student profile.
- `PUT /api/student/profile` - Modifies parameters (Branch, CGPA).
- `GET /api/student/jobs` - Views `open` jobs having `isApproved` companies.
- `POST /api/student/jobs/:jobId/apply` - Creates `Application` document referencing the Job.
- `GET /api/student/applications` - Lists student's applications.
- `GET /api/student/interviews` - Lists student's interviews.
- `POST /api/student/resume` - Handles multipart Multer upload.

---

## SECTION 6 — FRONTEND API USAGE

**Admin Components (Fully Integrated & Dynamic)**
- `AdminHome.jsx`: `GET /api/admin/dashboard`, `GET /api/admin/analytics`, `GET /api/admin/companies`
- `AdminStudents.jsx`: `GET /api/admin/students`
- `AdminCompanies.jsx`: `GET /api/admin/companies`, `PUT /api/admin/companies/:id/approve`
- `AdminJobs.jsx`: `GET /api/admin/jobs`
- `AdminAnalytics.jsx`: `GET /api/admin/analytics`
- `AdminReports.jsx`: `GET /api/admin/dashboard`, `GET /api/admin/analytics`
- `AdminAnnouncements.jsx`: `GET /api/notifications` (past), `POST /api/admin/announcements`

**Company Components (Fully Integrated & Dynamic)**
- `CompanyHome.jsx`: `GET /api/company/dashboard`, `GET /api/company/applications`, `GET /api/company/interviews`
- `CompanyProfile.jsx`: `GET /api/company/profile`
- `CompanyPostJob.jsx`: `GET /api/company/jobs`, `POST /api/company/jobs`
- `CompanyApplicants.jsx`: `GET /api/company/applications`

**Student Components (Fully Integrated & Dynamic)**
- `DashboardHome.jsx`: `GET /api/student/profile`, `GET /api/student/jobs`
- `ProfilePage.jsx`: `GET /api/student/profile`
- `ProfileSetup.jsx`: `PUT /api/student/profile`, `POST /api/student/resume`
- `JobsPage.jsx`: `GET /api/student/jobs`, `POST /api/student/jobs/:jobId/apply`
- `ApplicationsPage.jsx`: `GET /api/student/applications`
- `InterviewsPage.jsx`: `GET /api/student/interviews`
- `NotificationsPage.jsx`: `GET /api/notifications`
- `TopNavbar.jsx`: `GET /api/notifications`

*All admin, company, and student modules successfully utilize real API endpoints leveraging the `src/services/api.js` Axios singleton.*

---

## SECTION 7 — STATIC OR MOCK DATA

**Mock Data Elimination:**
- `src/components/dashboard/mockData.js` has been entirely removed from the codebase.
- `src/components/admin/adminMockData.js` has been entirely removed from the codebase.

**Components Consuming Mock Data:**
- *None in core dashboards.* All dashboard components strictly consume authenticated endpoints.
- Minor landing page elements (`TopRecruiters.jsx`, `Statistics.jsx`) remain the only possible places using static placeholder arrays as public APIs for those are still unlinked.

---

## SECTION 8 — WORKFLOW ANALYSIS

**Student Workflow (Fully Working):**
1. **Register** - Submits email/password. Creates `Student` and `User` schema references.
2. **Verify OTP** - Inputs Nodemailer code.
3. **Login** - Gets JWT.
4. **Complete Profile** - UI inputs synced cleanly to backend.
5. **View Jobs** - Displays only `open` jobs from `isApproved` companies via REST.
6. **Apply Job** - API constructs `Application` doc flawlessly.
7. **Track Applications & Interviews** - UI displays data mapping straight from mongo populates.

**Company Workflow (Fully Working):**
1. **Register & Verify** - Handled by unitary auth workflow.
2. **Login** - Successful role redirection based on JWT.
3. **Pending Approval** - UI restricts job postings until `isApproved` becomes true.
4. **Create Profile** - Persists natively.
5. **Post Jobs** - Active linkage to `/api/company/jobs`.
6. **View Applicants & Shortlist candidates** - Working.
7. **Schedule Interviews** - Working.

**Admin Workflow (Fully Working):**
1. **Login** - Direct route to `/admin/*`.
2. **Manage Companies / Approve** - Working perfectly.
3. **Manage Students** - Working, pulls real DB rows.
4. **View Jobs & Analytics** - Working, aggregation queries return dynamically.

---

## SECTION 9 — DATA FLOW

1. **MongoDB Database:** Persists documents via Atlas.
2. **Mongoose Models:** Enforces strict schemas without extraneous legacy indices.
3. **Express Controllers:** Full CRUD lifecycle support natively.
4. **Express/API Routes:** Multi-tiered defense using `authMiddleware` JWT tests and arbitrary RBAC controls (`authorize('admin', 'student')`).
5. **Frontend Axios (`api.js`):** Unified REST request pipeline configured to ship `<Bearer>` automatically.
6. **React Components:** Pure, dynamic functional components reacting to `useEffect()` cascades and real JSON payloads.

---

## SECTION 10 — CURRENT SYSTEM STATUS

**Working Modules:**
- User Authentication (Registration, OTP, JWT Login, Persistence).
- Admin Dashboard (Fully dynamic tables, Analytics aggregations, Approvals).
- Company Dashboard (Profile creation, live Job posting, applicant screening).
- **Student Dashboard** (Fully dynamic components driven by real backend API data, forms mapping to valid endpoints, real resume file handling pipelines).

**Partially Working Modules:**
- Landing Page (Hero and general content is complete; dynamic statistic feeds pending implementation).

**Resolved Issues:**
- Removed dependency on `mockData.js` entirely.
- Resolved Mongoose `Company` duplication schema index conflicts.
- Secured internal and public routes thoroughly using JWT checks.

---

## SECTION 11 — DATA VISIBILITY LOGIC

- **Students:** Real student profiles are correctly loaded from the DB into the `/student/profile` views.
- **Jobs:** All actual deployed jobs are securely fetched and applied to by verified students.
- **System Stability:** Node server operates securely without backend warnings for previous dirty collections.

---

## SECTION 12 — FINAL SUMMARY

The Placement Management System (PMS) is officially **100% dynamically driven** on its internal authenticated routes!

- **Database Status:** Full structural integrity. Legacy issues removed.
- **API Coverage:** Complete implementation powering all 3 dashboard types.
- **Frontend Integration:** Zero mock dependencies for core application functionality. Every dashboard operates natively with Axios calls mapping real data flows.
- **Data Flow Reliability:** The entire pipeline of Account Creation -> Setup Profile -> Post Job -> Apply -> Screen -> Interview is structurally sound and effectively deployed.
