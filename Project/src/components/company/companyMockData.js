// ─── Mock Data for Company Dashboard ───

export const companyMockProfile = {
    companyName: 'TechNova Solutions',
    website: 'https://technova.com',
    description: 'Leading technology company specializing in AI and cloud computing solutions.',
    location: 'Bangalore, India',
    hrEmail: 'hr@technova.com',
    contactNumber: '+91 9876543210',
    isApproved: true,
};

export const companyMockStats = {
    activeJobs: 4,
    totalApplicants: 47,
    interviews: 12,
    selected: 5,
};

export const companyMockJobs = [
    { id: '1', title: 'Software Development Engineer', salary: 1800000, location: 'Bangalore', jobType: 'fulltime', eligibilityCgpa: 7.5, eligibleBranches: ['CSE', 'IT'], skillsRequired: ['React', 'Node.js', 'MongoDB'], deadline: '2026-04-15', status: 'open', applicantCount: 18, createdAt: '2026-03-01' },
    { id: '2', title: 'Data Science Intern', salary: 500000, location: 'Remote', jobType: 'internship', eligibilityCgpa: 7.0, eligibleBranches: ['CSE', 'IT', 'ECE'], skillsRequired: ['Python', 'Machine Learning'], deadline: '2026-04-20', status: 'open', applicantCount: 12, createdAt: '2026-03-03' },
    { id: '3', title: 'Frontend Developer', salary: 1200000, location: 'Hyderabad', jobType: 'fulltime', eligibilityCgpa: 6.5, eligibleBranches: ['CSE', 'IT'], skillsRequired: ['React', 'Tailwind CSS', 'TypeScript'], deadline: '2026-04-10', status: 'open', applicantCount: 9, createdAt: '2026-03-05' },
    { id: '4', title: 'Backend Engineer', salary: 1500000, location: 'Bangalore', jobType: 'fulltime', eligibilityCgpa: 7.0, eligibleBranches: ['CSE'], skillsRequired: ['Node.js', 'PostgreSQL', 'Docker'], deadline: '2026-03-25', status: 'closed', applicantCount: 8, createdAt: '2026-02-20' },
];

export const companyMockApplicants = [
    { id: '1', name: 'Aarav Sharma', email: 'aarav@email.com', branch: 'CSE', cgpa: 8.7, skills: ['React', 'Node.js', 'MongoDB'], phone: '+91 9112233445', status: 'applied', appliedDate: '2026-03-05', jobTitle: 'Software Development Engineer' },
    { id: '2', name: 'Priya Patel', email: 'priya@email.com', branch: 'IT', cgpa: 8.2, skills: ['React', 'TypeScript', 'Tailwind CSS'], phone: '+91 9223344556', status: 'shortlisted', appliedDate: '2026-03-04', jobTitle: 'Software Development Engineer' },
    { id: '3', name: 'Rahul Verma', email: 'rahul@email.com', branch: 'CSE', cgpa: 9.1, skills: ['Python', 'Machine Learning', 'TensorFlow'], phone: '+91 9334455667', status: 'interview', appliedDate: '2026-03-03', jobTitle: 'Data Science Intern' },
    { id: '4', name: 'Sneha Reddy', email: 'sneha@email.com', branch: 'CSE', cgpa: 7.8, skills: ['React', 'Node.js', 'AWS'], phone: '+91 9445566778', status: 'selected', appliedDate: '2026-03-02', jobTitle: 'Software Development Engineer' },
    { id: '5', name: 'Arjun Kumar', email: 'arjun@email.com', branch: 'IT', cgpa: 7.5, skills: ['Java', 'Spring Boot', 'MongoDB'], phone: '+91 9556677889', status: 'rejected', appliedDate: '2026-03-01', jobTitle: 'Backend Engineer' },
    { id: '6', name: 'Kavya Nair', email: 'kavya@email.com', branch: 'CSE', cgpa: 8.9, skills: ['React', 'Vue.js', 'CSS'], phone: '+91 9667788990', status: 'applied', appliedDate: '2026-03-06', jobTitle: 'Frontend Developer' },
    { id: '7', name: 'Deepak Singh', email: 'deepak@email.com', branch: 'ECE', cgpa: 7.2, skills: ['Python', 'Data Science'], phone: '+91 9778899001', status: 'shortlisted', appliedDate: '2026-03-04', jobTitle: 'Data Science Intern' },
    { id: '8', name: 'Meera Joshi', email: 'meera@email.com', branch: 'CSE', cgpa: 8.4, skills: ['React', 'Node.js', 'Docker'], phone: '+91 9889900112', status: 'applied', appliedDate: '2026-03-07', jobTitle: 'Frontend Developer' },
];

export const companyMockInterviews = [
    { id: '1', candidateName: 'Rahul Verma', jobTitle: 'Data Science Intern', date: '2026-03-12', time: '10:00 AM', type: 'online', meetLink: 'https://meet.google.com/abc-xyz', status: 'scheduled' },
    { id: '2', candidateName: 'Priya Patel', jobTitle: 'Software Development Engineer', date: '2026-03-14', time: '2:30 PM', type: 'offline', location: 'Campus Room A2', status: 'scheduled' },
    { id: '3', candidateName: 'Deepak Singh', jobTitle: 'Data Science Intern', date: '2026-03-10', time: '11:00 AM', type: 'online', meetLink: 'https://zoom.us/j/987654', status: 'completed' },
];

export const branchOptions = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'];
