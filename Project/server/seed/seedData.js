import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Import models
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import PlacementReport from '../models/PlacementReport.js';
import Resume from '../models/Resume.js';

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Drop stale unique indexes from previous schema versions
        const db = mongoose.connection.db;
        const dropIndex = async (collName, idxName) => {
            try { await db.collection(collName).dropIndex(idxName); console.log(`🗑️  Dropped stale index ${idxName} from ${collName}`); }
            catch { /* index doesn't exist — OK */ }
        };
        await dropIndex('companies', 'userId_1');
        await dropIndex('applications', 'studentId_1_jobId_1');
        await dropIndex('placementreports', 'year_1_branch_1');

        // ─── COMPANIES ───
        if ((await Company.countDocuments()) === 0) {
            await Company.insertMany([
                {
                    companyId: 'CMP001',
                    name: 'TechNova Solutions',
                    companyName: 'TechNova Solutions',
                    industry: 'Software Development',
                    location: 'Bangalore',
                    website: 'https://technova.com',
                    description: 'Leading AI and cloud software company building next-generation enterprise solutions.',
                    hrName: 'Rahul Mehta',
                    hrEmail: 'rahul@technova.com',
                    hrPhone: '+91-9876543210',
                    logo: 'https://via.placeholder.com/120',
                    isActive: true,
                    isApproved: true,
                },
                {
                    companyId: 'CMP002',
                    name: 'DataVerse Analytics',
                    companyName: 'DataVerse Analytics',
                    industry: 'Data Science & Analytics',
                    location: 'Hyderabad',
                    website: 'https://dataverse.io',
                    description: 'Data-driven analytics firm specializing in business intelligence and ML-powered insights.',
                    hrName: 'Sneha Kapoor',
                    hrEmail: 'sneha@dataverse.io',
                    hrPhone: '+91-9123456780',
                    logo: 'https://via.placeholder.com/120',
                    isActive: true,
                    isApproved: true,
                },
            ]);
            console.log('📦 Seeded 2 companies');
        } else {
            console.log('⏭️  Companies collection already has data — skipping');
        }

        // ─── JOBS ───
        if ((await Job.countDocuments()) === 0) {
            await Job.insertMany([
                {
                    jobId: 'JOB001',
                    companyId: 'CMP001',
                    companyName: 'TechNova Solutions',
                    title: 'Software Development Engineer',
                    description: 'Design and develop scalable microservices using Node.js and React. Collaborate with cross-functional teams to deliver high-quality products.',
                    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Docker'],
                    skillsRequired: ['React', 'Node.js', 'MongoDB', 'Docker'],
                    package: 1800000,
                    salary: 1800000,
                    location: 'Bangalore',
                    jobType: 'fulltime',
                    minCGPA: 7.5,
                    eligibilityCgpa: 7.5,
                    eligibleBranches: ['CSE', 'IT'],
                    openings: 5,
                    deadline: new Date('2026-04-15'),
                    status: 'open',
                    postedAt: new Date('2026-03-01'),
                },
                {
                    jobId: 'JOB002',
                    companyId: 'CMP002',
                    companyName: 'DataVerse Analytics',
                    title: 'Data Science Intern',
                    description: 'Work on real-world datasets to build predictive models using Python and machine learning frameworks. Assist in data pipeline development.',
                    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
                    skillsRequired: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
                    package: 500000,
                    salary: 500000,
                    location: 'Hyderabad',
                    jobType: 'internship',
                    minCGPA: 7.0,
                    eligibilityCgpa: 7.0,
                    eligibleBranches: ['CSE', 'IT', 'ECE'],
                    openings: 3,
                    deadline: new Date('2026-04-20'),
                    status: 'open',
                    postedAt: new Date('2026-03-05'),
                },
            ]);
            console.log('📦 Seeded 2 jobs');
        } else {
            console.log('⏭️  Jobs collection already has data — skipping');
        }

        // ─── APPLICATIONS ───
        if ((await Application.countDocuments()) === 0) {
            await Application.insertMany([
                {
                    applicationId: 'APP001',
                    studentId: 'STU001',
                    studentName: 'Aarav Sharma',
                    jobId: 'JOB001',
                    jobTitle: 'Software Development Engineer',
                    companyId: 'CMP001',
                    companyName: 'TechNova Solutions',
                    appliedAt: new Date('2026-03-06'),
                    appliedDate: new Date('2026-03-06'),
                    status: 'shortlisted',
                    currentRound: 'Technical Round 1',
                    remarks: 'Strong React and Node.js skills.',
                },
                {
                    applicationId: 'APP002',
                    studentId: 'STU002',
                    studentName: 'Priya Patel',
                    jobId: 'JOB002',
                    jobTitle: 'Data Science Intern',
                    companyId: 'CMP002',
                    companyName: 'DataVerse Analytics',
                    appliedAt: new Date('2026-03-07'),
                    appliedDate: new Date('2026-03-07'),
                    status: 'applied',
                    currentRound: 'Screening',
                    remarks: '',
                },
            ]);
            console.log('📦 Seeded 2 applications');
        } else {
            console.log('⏭️  Applications collection already has data — skipping');
        }

        // ─── INTERVIEWS ───
        if ((await Interview.countDocuments()) === 0) {
            await Interview.insertMany([
                {
                    interviewId: 'INT001',
                    applicationId: 'APP001',
                    studentId: 'STU001',
                    studentName: 'Aarav Sharma',
                    companyId: 'CMP001',
                    companyName: 'TechNova Solutions',
                    jobId: 'JOB001',
                    jobTitle: 'Software Development Engineer',
                    scheduledDate: new Date('2026-03-20'),
                    scheduledTime: '10:00 AM',
                    mode: 'online',
                    venue: 'Google Meet',
                    round: 'Technical Round 1',
                    status: 'scheduled',
                    feedback: '',
                },
                {
                    interviewId: 'INT002',
                    applicationId: 'APP002',
                    studentId: 'STU002',
                    studentName: 'Priya Patel',
                    companyId: 'CMP002',
                    companyName: 'DataVerse Analytics',
                    jobId: 'JOB002',
                    jobTitle: 'Data Science Intern',
                    scheduledDate: new Date('2026-03-22'),
                    scheduledTime: '2:30 PM',
                    mode: 'offline',
                    venue: 'Campus Room B3',
                    round: 'HR Round',
                    status: 'scheduled',
                    feedback: '',
                },
            ]);
            console.log('📦 Seeded 2 interviews');
        } else {
            console.log('⏭️  Interviews collection already has data — skipping');
        }

        // ─── MESSAGES ───
        if ((await Message.countDocuments()) === 0) {
            await Message.insertMany([
                {
                    messageId: 'MSG001',
                    senderId: 'CMP001',
                    senderName: 'Rahul Mehta',
                    senderRole: 'company',
                    receiverId: 'STU001',
                    receiverName: 'Aarav Sharma',
                    content: 'Hi Aarav, congratulations on being shortlisted! Please prepare for the technical interview on March 20.',
                    timestamp: new Date('2026-03-08T10:30:00'),
                    isRead: false,
                    conversationId: 'CONV001',
                },
                {
                    messageId: 'MSG002',
                    senderId: 'STU001',
                    senderName: 'Aarav Sharma',
                    senderRole: 'student',
                    receiverId: 'CMP001',
                    receiverName: 'Rahul Mehta',
                    content: 'Thank you, Rahul! I will be well prepared. Could you share the meeting link?',
                    timestamp: new Date('2026-03-08T11:15:00'),
                    isRead: true,
                    conversationId: 'CONV001',
                },
            ]);
            console.log('📦 Seeded 2 messages');
        } else {
            console.log('⏭️  Messages collection already has data — skipping');
        }

        // ─── NOTIFICATIONS ───
        if ((await Notification.countDocuments()) === 0) {
            await Notification.insertMany([
                {
                    notificationId: 'NTF001',
                    targetRole: 'company',
                    title: 'New Application Received',
                    message: 'Aarav Sharma has applied for Software Development Engineer at TechNova Solutions.',
                    type: 'job',
                    timestamp: new Date('2026-03-06T14:00:00'),
                    isRead: false,
                    companyId: 'CMP001',
                },
                {
                    notificationId: 'NTF002',
                    targetRole: 'company',
                    title: 'Interview Reminder',
                    message: 'Reminder: Interview with Priya Patel for Data Science Intern is scheduled on March 22.',
                    type: 'interview',
                    timestamp: new Date('2026-03-10T09:00:00'),
                    isRead: false,
                    companyId: 'CMP002',
                },
            ]);
            console.log('📦 Seeded 2 notifications');
        } else {
            console.log('⏭️  Notifications collection already has data — skipping');
        }

        // ─── PLACEMENT REPORTS ───
        if ((await PlacementReport.countDocuments()) === 0) {
            await PlacementReport.insertMany([
                {
                    reportId: 'RPT001',
                    companyId: 'CMP001',
                    companyName: 'TechNova Solutions',
                    academicYear: '2025-2026',
                    totalApplications: 45,
                    totalHired: 8,
                    averagePackage: 1600000,
                    highestPackage: 2400000,
                    branchWiseHiring: { CSE: 5, IT: 2, ECE: 1 },
                    status: 'published',
                    generatedAt: new Date('2026-03-01'),
                },
                {
                    reportId: 'RPT002',
                    companyId: 'CMP002',
                    companyName: 'DataVerse Analytics',
                    academicYear: '2025-2026',
                    totalApplications: 32,
                    totalHired: 5,
                    averagePackage: 900000,
                    highestPackage: 1200000,
                    branchWiseHiring: { CSE: 3, IT: 1, ECE: 1 },
                    status: 'published',
                    generatedAt: new Date('2026-03-05'),
                },
            ]);
            console.log('📦 Seeded 2 placement reports');
        } else {
            console.log('⏭️  PlacementReports collection already has data — skipping');
        }

        // ─── RESUMES ───
        if ((await Resume.countDocuments()) === 0) {
            await Resume.insertMany([
                {
                    resumeId: 'RES001',
                    studentId: 'STU001',
                    studentName: 'Aarav Sharma',
                    fileUrl: '/uploads/resumes/aarav_sharma_resume.pdf',
                    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker'],
                    totalExperience: '6 months internship',
                    education: ['B.Tech CSE - CGPA 8.7', 'XII - 92%', 'X - 95%'],
                    uploadedAt: new Date('2026-02-28'),
                    isShortlistedByCompany: ['CMP001'],
                    lastUpdated: new Date('2026-03-05'),
                },
                {
                    resumeId: 'RES002',
                    studentId: 'STU002',
                    studentName: 'Priya Patel',
                    fileUrl: '/uploads/resumes/priya_patel_resume.pdf',
                    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow'],
                    totalExperience: '3 months project work',
                    education: ['B.Tech IT - CGPA 8.2', 'XII - 88%', 'X - 91%'],
                    uploadedAt: new Date('2026-03-01'),
                    isShortlistedByCompany: [],
                    lastUpdated: new Date('2026-03-06'),
                },
            ]);
            console.log('📦 Seeded 2 resumes');
        } else {
            console.log('⏭️  Resumes collection already has data — skipping');
        }

        console.log('\n✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

seedData();
