// ─── Mock Data for Admin Dashboard ───

export const adminMockStats = {
    totalStudents: 248,
    totalCompanies: 32,
    activeJobs: 18,
    totalPlacements: 87,
    pendingCompanies: 5,
    totalApplications: 456,
};

export const adminMockCompanies = [
    { id: '1', companyName: 'TechNova Solutions', email: 'hr@technova.com', location: 'Bangalore', isApproved: true, jobsPosted: 4, createdAt: '2026-02-15' },
    { id: '2', companyName: 'CloudSync Inc', email: 'careers@cloudsync.com', location: 'Hyderabad', isApproved: true, jobsPosted: 3, createdAt: '2026-02-20' },
    { id: '3', companyName: 'DataWave Analytics', email: 'hr@datawave.io', location: 'Pune', isApproved: false, jobsPosted: 0, createdAt: '2026-03-05' },
    { id: '4', companyName: 'Urban Mobility Labs', email: 'talent@urbanmobility.com', location: 'Mumbai', isApproved: false, jobsPosted: 0, createdAt: '2026-03-07' },
    { id: '5', companyName: 'FinTech Pro', email: 'hr@fintechpro.com', location: 'Noida', isApproved: true, jobsPosted: 5, createdAt: '2026-01-10' },
    { id: '6', companyName: 'GreenScale Energy', email: 'careers@greenscale.com', location: 'Chennai', isApproved: false, jobsPosted: 0, createdAt: '2026-03-08' },
    { id: '7', companyName: 'NexGen Robotics', email: 'hr@nexgenrobotics.com', location: 'Bangalore', isApproved: true, jobsPosted: 2, createdAt: '2026-02-01' },
    { id: '8', companyName: 'Skyline Software', email: 'recruit@skyline.dev', location: 'Hyderabad', isApproved: false, jobsPosted: 0, createdAt: '2026-03-09' },
    { id: '9', companyName: 'MediCare AI', email: 'careers@medicareai.com', location: 'Delhi', isApproved: false, jobsPosted: 0, createdAt: '2026-03-10' },
    { id: '10', companyName: 'Infosys', email: 'campus@infosys.com', location: 'Pune', isApproved: true, jobsPosted: 6, createdAt: '2025-12-15' },
];

export const adminMockStudents = [
    { id: '1', name: 'Aarav Sharma', email: 'aarav@email.com', branch: 'CSE', cgpa: 8.7, placementStatus: 'placed', profileCompleted: true },
    { id: '2', name: 'Priya Patel', email: 'priya@email.com', branch: 'IT', cgpa: 8.2, placementStatus: 'unplaced', profileCompleted: true },
    { id: '3', name: 'Rahul Verma', email: 'rahul@email.com', branch: 'CSE', cgpa: 9.1, placementStatus: 'placed', profileCompleted: true },
    { id: '4', name: 'Sneha Reddy', email: 'sneha@email.com', branch: 'CSE', cgpa: 7.8, placementStatus: 'placed', profileCompleted: true },
    { id: '5', name: 'Arjun Kumar', email: 'arjun@email.com', branch: 'IT', cgpa: 7.5, placementStatus: 'unplaced', profileCompleted: true },
    { id: '6', name: 'Kavya Nair', email: 'kavya@email.com', branch: 'ECE', cgpa: 8.9, placementStatus: 'placed', profileCompleted: true },
    { id: '7', name: 'Deepak Singh', email: 'deepak@email.com', branch: 'ME', cgpa: 7.2, placementStatus: 'unplaced', profileCompleted: false },
    { id: '8', name: 'Meera Joshi', email: 'meera@email.com', branch: 'CSE', cgpa: 8.4, placementStatus: 'placed', profileCompleted: true },
    { id: '9', name: 'Ravi Teja', email: 'ravi@email.com', branch: 'ECE', cgpa: 6.8, placementStatus: 'unplaced', profileCompleted: true },
    { id: '10', name: 'Ananya Gupta', email: 'ananya@email.com', branch: 'IT', cgpa: 8.0, placementStatus: 'unplaced', profileCompleted: true },
];

export const adminMockJobs = [
    { id: '1', title: 'SDE', company: 'TechNova Solutions', salary: 1800000, location: 'Bangalore', status: 'open', applicantCount: 18, deadline: '2026-04-15' },
    { id: '2', title: 'Data Science Intern', company: 'DataWave Analytics', salary: 500000, location: 'Remote', status: 'open', applicantCount: 12, deadline: '2026-04-20' },
    { id: '3', title: 'Frontend Developer', company: 'CloudSync Inc', salary: 1200000, location: 'Hyderabad', status: 'open', applicantCount: 9, deadline: '2026-04-10' },
    { id: '4', title: 'Backend Engineer', company: 'FinTech Pro', salary: 1500000, location: 'Noida', status: 'closed', applicantCount: 8, deadline: '2026-03-25' },
    { id: '5', title: 'ML Engineer', company: 'NexGen Robotics', salary: 2000000, location: 'Bangalore', status: 'open', applicantCount: 15, deadline: '2026-04-30' },
    { id: '6', title: 'DevOps Engineer', company: 'Infosys', salary: 1000000, location: 'Pune', status: 'open', applicantCount: 7, deadline: '2026-04-18' },
];

export const adminAnalyticsData = {
    placementPercentage: 65,
    averageSalary: 1250000,
    highestSalary: 4500000,
    branchWise: [
        { branch: 'CSE', total: 80, placed: 62 },
        { branch: 'IT', total: 60, placed: 35 },
        { branch: 'ECE', total: 50, placed: 25 },
        { branch: 'ME', total: 35, placed: 12 },
        { branch: 'CE', total: 23, placed: 8 },
    ],
    companyWise: [
        { company: 'TechNova Solutions', hires: 15 },
        { company: 'Infosys', hires: 22 },
        { company: 'FinTech Pro', hires: 12 },
        { company: 'CloudSync Inc', hires: 10 },
        { company: 'NexGen Robotics', hires: 8 },
    ],
    monthlyPlacements: [
        { month: 'Sep', placements: 5 },
        { month: 'Oct', placements: 8 },
        { month: 'Nov', placements: 12 },
        { month: 'Dec', placements: 18 },
        { month: 'Jan', placements: 22 },
        { month: 'Feb', placements: 15 },
        { month: 'Mar', placements: 7 },
    ],
};

export const adminMockAnnouncements = [
    { id: '1', title: 'Campus Drive - March 2026', message: 'Multiple companies visiting campus March 10-15. Ensure profiles are updated.', date: '2026-03-01', recipients: 248 },
    { id: '2', title: 'Resume Workshop', message: 'Resume building workshop on March 8 in Seminar Hall.', date: '2026-02-28', recipients: 248 },
    { id: '3', title: 'Placement Eligibility Update', message: 'Students with backlogs must clear them before placement season.', date: '2026-02-25', recipients: 248 },
];
