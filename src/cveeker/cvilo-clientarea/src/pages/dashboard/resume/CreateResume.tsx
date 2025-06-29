import ResumeForm, { type ResumeFormValues } from "./components/ResumeForm";

// Default values to match the schema structure exactly
const defaultValues: ResumeFormValues = {
  id: "",
  title: "Senior Software Engineer Resume",
  isActive: true,
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "1234 Elm Street, Springfield, IL",
  website: "https://johndoe.dev",
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  summary: "Experienced software engineer with a history of building scalable web applications using modern technologies.",
  objective: "To leverage my full-stack development skills in a challenging role at a forward-thinking company.",
  experience: [
    {
      company: "OpenAI",
      position: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "2019-06-01",
      endDate: "",
      isCurrent: true,
      description: "Developed AI-driven features, collaborated with research teams, and optimized performance across services.",
      technologies: "JavaScript, React, Node.js, Python"
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
      description: "Focused on software engineering, algorithms, and data structures. Graduated with honors."
    }
  ],
  skills: [
    { name: "JavaScript", category: "Programming", level: 5, yearsExp: 7 }
  ],
  languages: [
    { name: "English", proficiency: "Native" }
  ],
  certifications: [
    {
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      issueDate: "2020-08-20",
      expiryDate: "2023-08-20",
      credentialID: "CKA-XXXXX",
      url: "https://www.cncf.io/certification/cka/"
    }
  ],
  projects: [
    {
      name: "Personal Portfolio Website",
      description: "A responsive website showcasing my projects and blog posts.",
      technologies: "React, Next.js, Tailwind CSS",
      startDate: "2021-01-15",
      endDate: "2021-03-30",
      url: "https://johndoe.dev",
      github: "https://github.com/johndoe/portfolio"
    }
  ],
  awards: "Dean's List (2013, 2014, 2015)",
  interests: "Hiking, Photography, Open Source Contribution",
  references: "Available upon request",
  template: "light",
  theme: "light",
};

const CreateResume = () => {
  return (
    <ResumeForm resume={defaultValues} editMode={false} />
  );
};

export default CreateResume;