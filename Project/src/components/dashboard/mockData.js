// ─── Mock Data for Student Dashboard ───

export const mockUser = {
    id: '1',
    name: 'Neel Patel',
    email: 'rockygaming9090@gmail.com',
    role: 'student',
    profileCompleted: true,
};

export const mockStudent = {
    enrollmentNo: 'EN2024001',
    branch: 'CSE',
    phone: '+91 9876543210',
    dob: '2003-05-15',
    gender: 'male',
    address: 'Ahmedabad, Gujarat',
    tenthPercentage: 92,
    twelfthPercentage: 88,
    cgpa: 8.5,
    currentSemester: 6,
    backlogs: false,
    skills: ['React', 'Node.js', 'MongoDB', 'Python', 'Java', 'Tailwind CSS'],
    projects: ['Placement Management System', 'E-Commerce Platform', 'Chat Application'],
    certifications: ['AWS Cloud Practitioner', 'Google Data Analytics'],
    internshipExperience: '3 months at TechCorp as Full Stack Developer',
    linkedin: 'https://linkedin.com/in/neelpatel',
    github: 'https://github.com/NeelPatel2548',
    placementStatus: 'unplaced',
    resumeUploaded: true,
    resumeVersion: 'v3.2',
    resumeLastUpdated: '2026-02-28',
};

export const mockJobs = [
    { id: 1, company: 'Amazon', logo: '🅰️', role: 'Software Development Engineer', salary: '20 LPA', location: 'Bangalore', deadline: '2026-08-15', eligibilityCgpa: 7.5, eligibleBranches: ['CSE', 'IT'], type: 'Full Time', posted: '2026-03-01' },
    { id: 2, company: 'Infosys', logo: '🔷', role: 'System Engineer', salary: '6 LPA', location: 'Pune', deadline: '2026-08-20', eligibilityCgpa: 6.5, eligibleBranches: ['CSE', 'IT', 'ECE'], type: 'Full Time', posted: '2026-03-02' },
    { id: 3, company: 'Google', logo: '🔵', role: 'Frontend Engineer', salary: '25 LPA', location: 'Hyderabad', deadline: '2026-07-30', eligibilityCgpa: 8.0, eligibleBranches: ['CSE'], type: 'Full Time', posted: '2026-02-28' },
    { id: 4, company: 'Microsoft', logo: '🟦', role: 'Software Engineer', salary: '22 LPA', location: 'Noida', deadline: '2026-08-10', eligibilityCgpa: 7.5, eligibleBranches: ['CSE', 'IT'], type: 'Full Time', posted: '2026-03-01' },
    { id: 5, company: 'TCS', logo: '🟢', role: 'Developer', salary: '7 LPA', location: 'Mumbai', deadline: '2026-09-01', eligibilityCgpa: 6.0, eligibleBranches: ['CSE', 'IT', 'ECE', 'ME'], type: 'Full Time', posted: '2026-03-03' },
    { id: 6, company: 'Wipro', logo: '🌐', role: 'Project Engineer', salary: '5.5 LPA', location: 'Chennai', deadline: '2026-08-25', eligibilityCgpa: 6.0, eligibleBranches: ['CSE', 'IT', 'ECE'], type: 'Full Time', posted: '2026-03-02' },
    { id: 7, company: 'Adobe', logo: '🔴', role: 'Product Engineer', salary: '18 LPA', location: 'Bangalore', deadline: '2026-07-25', eligibilityCgpa: 7.0, eligibleBranches: ['CSE', 'IT'], type: 'Full Time', posted: '2026-02-25' },
    { id: 8, company: 'Flipkart', logo: '🟡', role: 'Backend Developer', salary: '16 LPA', location: 'Bangalore', deadline: '2026-08-05', eligibilityCgpa: 7.0, eligibleBranches: ['CSE', 'IT'], type: 'Full Time', posted: '2026-03-01' },
    { id: 9, company: 'Deloitte', logo: '🟣', role: 'Analyst', salary: '8 LPA', location: 'Hyderabad', deadline: '2026-08-18', eligibilityCgpa: 6.5, eligibleBranches: ['CSE', 'IT', 'ECE', 'ME'], type: 'Full Time', posted: '2026-03-04' },
    { id: 10, company: 'Razorpay', logo: '💙', role: 'Full Stack Developer', salary: '15 LPA', location: 'Bangalore', deadline: '2026-08-12', eligibilityCgpa: 7.0, eligibleBranches: ['CSE', 'IT'], type: 'Full Time', posted: '2026-03-03' },
    { id: 11, company: 'Zoho', logo: '🟠', role: 'Software Developer', salary: '10 LPA', location: 'Chennai', deadline: '2026-09-05', eligibilityCgpa: 6.5, eligibleBranches: ['CSE', 'IT'], type: 'Full Time', posted: '2026-03-05' },
    { id: 12, company: 'PayPal', logo: '💜', role: 'Data Engineer', salary: '19 LPA', location: 'Bangalore', deadline: '2026-08-08', eligibilityCgpa: 7.5, eligibleBranches: ['CSE'], type: 'Full Time', posted: '2026-03-02' },
];

export const mockApplications = [
    { id: 1, company: 'Amazon', role: 'SDE', appliedDate: '2026-03-01', status: 'shortlisted' },
    { id: 2, company: 'Google', role: 'Frontend Engineer', appliedDate: '2026-02-28', status: 'interview' },
    { id: 3, company: 'Infosys', role: 'System Engineer', appliedDate: '2026-03-02', status: 'applied' },
    { id: 4, company: 'TCS', role: 'Developer', appliedDate: '2026-03-03', status: 'selected' },
    { id: 5, company: 'Wipro', role: 'Project Engineer', appliedDate: '2026-03-02', status: 'rejected' },
    { id: 6, company: 'Adobe', role: 'Product Engineer', appliedDate: '2026-02-25', status: 'shortlisted' },
];

export const mockInterviews = [
    { id: 1, company: 'Google', date: '2026-03-10', time: '10:00 AM', type: 'Online', meetLink: 'https://meet.google.com/abc-defg-hij' },
    { id: 2, company: 'Amazon', date: '2026-03-12', time: '2:00 PM', type: 'Offline', location: 'Campus Hall B' },
    { id: 3, company: 'Adobe', date: '2026-03-15', time: '11:30 AM', type: 'Online', meetLink: 'https://zoom.us/j/123456' },
];

export const mockNotifications = [
    { id: 1, title: 'Shortlisted by Amazon', message: 'You have been shortlisted for the SDE position at Amazon.', time: '2 hours ago', read: false, type: 'success' },
    { id: 2, title: 'New Job Posted', message: 'Zoho has posted a new Software Developer role.', time: '5 hours ago', read: false, type: 'info' },
    { id: 3, title: 'Interview Scheduled', message: 'Your interview with Google is scheduled for March 10.', time: '1 day ago', read: true, type: 'warning' },
    { id: 4, title: 'Application Received', message: 'Your application for TCS Developer role has been received.', time: '2 days ago', read: true, type: 'info' },
    { id: 5, title: 'Password Changed', message: 'Your account password was successfully updated.', time: '3 days ago', read: true, type: 'security' },
    { id: 6, title: 'Profile Updated', message: 'Your profile has been updated successfully.', time: '4 days ago', read: true, type: 'info' },
];

export const mockAnnouncements = [
    { id: 1, title: 'Campus Drive - March 2026', message: 'Multiple companies will be visiting campus between March 10-15. Ensure your profiles are updated.', date: '2026-03-01', author: 'Placement Cell' },
    { id: 2, title: 'Resume Workshop', message: 'A resume building workshop will be held on March 8 in Seminar Hall. All students are encouraged to attend.', date: '2026-02-28', author: 'Training Department' },
];

export const mockAnalytics = {
    applicationsVsInterviews: [
        { month: 'Oct', applications: 2, interviews: 0 },
        { month: 'Nov', applications: 5, interviews: 1 },
        { month: 'Dec', applications: 3, interviews: 2 },
        { month: 'Jan', applications: 8, interviews: 3 },
        { month: 'Feb', applications: 6, interviews: 4 },
        { month: 'Mar', applications: 4, interviews: 3 },
    ],
    placementProgress: [
        { name: 'Applied', value: 6 },
        { name: 'Shortlisted', value: 2 },
        { name: 'Interview', value: 1 },
        { name: 'Selected', value: 1 },
        { name: 'Rejected', value: 1 },
    ],
    testPerformance: [
        { test: 'Aptitude 1', score: 78 },
        { test: 'Coding 1', score: 85 },
        { test: 'Aptitude 2', score: 90 },
        { test: 'Coding 2', score: 72 },
        { test: 'Mock Int.', score: 88 },
    ],
};

export const mockStats = {
    jobsAvailable: 12,
    applicationsSent: 6,
    interviewsScheduled: 3,
    offersReceived: 1,
};

export const skillOptions = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Machine Learning', 'Data Science', 'Deep Learning',
    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
    'Git', 'Linux', 'REST API', 'GraphQL',
];
