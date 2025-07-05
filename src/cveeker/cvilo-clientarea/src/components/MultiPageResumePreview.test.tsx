import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import MultiPageResumePreview from './MultiPageResumePreview';
import type { ResumeFormValues } from '../pages/dashboard/resume/components/ResumeForm';

// Test data with enough content to span multiple pages
const testResumeData: ResumeFormValues = {
  id: "test",
  title: "Test Resume - Multi Page",
  isActive: true,
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "1234 Elm Street, Springfield, IL",
  website: "https://johndoe.dev",
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  summary: "Experienced software engineer with a history of building scalable web applications using modern technologies. Specialized in full-stack development with expertise in React, Node.js, and cloud technologies. Passionate about creating user-friendly applications and solving complex technical challenges.",
  objective: "To leverage my full-stack development skills in a challenging role at a forward-thinking company where I can contribute to innovative projects and continue growing professionally.",
  experience: [
    {
      company: "OpenAI",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2019-06-01",
      endDate: "",
      isCurrent: true,
      description: "Developed AI-driven features, collaborated with research teams, and optimized performance across services. Led the development of machine learning pipelines and implemented scalable solutions for processing large datasets. Mentored junior developers and contributed to architectural decisions.",
      technologies: "JavaScript, React, Node.js, Python, TensorFlow, AWS"
    },
    {
      company: "Google",
      position: "Software Engineer",
      location: "Mountain View, CA",
      startDate: "2017-03-01",
      endDate: "2019-05-31",
      isCurrent: false,
      description: "Worked on Google Cloud Platform services, developing APIs and backend services. Implemented microservices architecture and contributed to the development of cloud-native applications. Collaborated with cross-functional teams to deliver high-quality software solutions.",
      technologies: "Go, Python, Kubernetes, Docker, Google Cloud Platform"
    },
    {
      company: "Microsoft",
      position: "Software Engineer",
      location: "Redmond, WA",
      startDate: "2015-08-01",
      endDate: "2017-02-28",
      isCurrent: false,
      description: "Developed Windows applications and contributed to the Windows ecosystem. Worked on performance optimization and user experience improvements. Participated in code reviews and mentored interns.",
      technologies: "C#, .NET, Windows API, Visual Studio"
    }
  ],
  education: [
    {
      institution: "University of Illinois Urbana-Champaign",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Urbana, IL",
      startDate: "2012-09-01",
      endDate: "2016-05-15",
      gpa: "3.8",
      description: "Focused on software engineering, algorithms, and data structures. Graduated with honors. Completed capstone project on distributed systems. Active member of ACM and participated in hackathons."
    },
    {
      institution: "Stanford University",
      degree: "Master of Science",
      fieldOfStudy: "Computer Science",
      location: "Stanford, CA",
      startDate: "2016-09-01",
      endDate: "2018-06-15",
      gpa: "3.9",
      description: "Specialized in artificial intelligence and machine learning. Conducted research on natural language processing. Published papers in top-tier conferences."
    }
  ],
  skills: [
    { name: "JavaScript", category: "Programming", level: 5, yearsExp: 7 },
    { name: "React", category: "Frontend", level: 5, yearsExp: 6 },
    { name: "Node.js", category: "Backend", level: 5, yearsExp: 6 },
    { name: "Python", category: "Programming", level: 4, yearsExp: 5 },
    { name: "Go", category: "Programming", level: 4, yearsExp: 3 },
    { name: "TypeScript", category: "Programming", level: 4, yearsExp: 4 },
    { name: "AWS", category: "Cloud", level: 4, yearsExp: 4 },
    { name: "Docker", category: "DevOps", level: 4, yearsExp: 3 },
    { name: "Kubernetes", category: "DevOps", level: 3, yearsExp: 2 },
    { name: "MongoDB", category: "Database", level: 4, yearsExp: 3 },
    { name: "PostgreSQL", category: "Database", level: 4, yearsExp: 3 },
    { name: "Redis", category: "Database", level: 3, yearsExp: 2 }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Intermediate" },
    { name: "French", proficiency: "Basic" }
  ],
  certifications: [
    {
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      issueDate: "2020-08-20",
      expiryDate: "2023-08-20",
      credentialID: "CKA-XXXXX",
      url: "https://www.cncf.io/certification/cka/"
    },
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "2019-03-15",
      expiryDate: "2022-03-15",
      credentialID: "AWS-SAA-XXXXX",
      url: "https://aws.amazon.com/certification/"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      issueDate: "2018-11-10",
      expiryDate: "2021-11-10",
      credentialID: "GCP-PD-XXXXX",
      url: "https://cloud.google.com/certification/"
    }
  ],
  projects: [
    {
      name: "Personal Portfolio Website",
      description: "A responsive website showcasing my projects and blog posts. Features a modern design with dark mode support and optimized performance.",
      technologies: "React, Next.js, Tailwind CSS, Vercel",
      startDate: "2021-01-15",
      endDate: "2021-03-30",
      url: "https://johndoe.dev",
      github: "https://github.com/johndoe/portfolio"
    },
    {
      name: "E-commerce Platform",
      description: "Full-stack e-commerce platform with payment integration, inventory management, and admin dashboard. Handles thousands of concurrent users.",
      technologies: "Node.js, React, MongoDB, Stripe, Redis",
      startDate: "2020-06-01",
      endDate: "2020-12-15",
      url: "https://shop.example.com",
      github: "https://github.com/johndoe/ecommerce"
    },
    {
      name: "Machine Learning API",
      description: "RESTful API for machine learning model inference. Supports multiple models and provides real-time predictions with caching.",
      technologies: "Python, FastAPI, TensorFlow, Docker, AWS",
      startDate: "2019-09-01",
      endDate: "2020-02-28",
      url: "https://api.ml.example.com",
      github: "https://github.com/johndoe/ml-api"
    }
  ],
  awards: "Dean's List (2013, 2014, 2015), Best Senior Project Award (2016), Microsoft MVP Award (2018), Google Developer Expert (2019)",
  interests: "Hiking, Photography, Open Source Contribution, Machine Learning Research, Reading Science Fiction",
  references: "Available upon request. Professional references from current and previous employers can be provided.",
  template: "modern",
  theme: "modern-blue",
};

const MultiPageResumePreviewTest: React.FC = () => {
  const [currentTheme, setCurrentTheme] = React.useState('modern-blue');
  const [isPrintMode, setIsPrintMode] = React.useState(false);

  const themes = [
    'modern-blue',
    'classic-black',
    'minimal-white',
    'professional-green',
    'creative-purple'
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Multi-Page Resume Preview Test
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="outlined" 
          onClick={() => setIsPrintMode(!isPrintMode)}
        >
          {isPrintMode ? 'Exit Print Mode' : 'Enter Print Mode'}
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2">Theme:</Typography>
          {themes.map((theme) => (
            <Button
              key={theme}
              size="small"
              variant={currentTheme === theme ? 'contained' : 'outlined'}
              onClick={() => setCurrentTheme(theme)}
            >
              {theme}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Current Theme: {currentTheme} | Mode: {isPrintMode ? 'Print' : 'Preview'}
        </Typography>
      </Box>

      <MultiPageResumePreview
        data={testResumeData}
        theme={currentTheme}
        printMode={isPrintMode}
      />
    </Box>
  );
};

export default MultiPageResumePreviewTest; 