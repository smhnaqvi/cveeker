import React, { useState } from "react";
import { Box, Stack, Typography, IconButton, Grid, Checkbox, FormControlLabel, Card, CardHeader, CardContent, Accordion, AccordionSummary, AccordionDetails, Alert, CircularProgress } from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import FormProvider from "../../../provider/FormProvider";
import { RHFInput as Input } from "../../../components/Input";
import Button from "../../../components/Button";
import { Add, Delete, ExpandMore } from "@mui/icons-material";
import { useRef } from "react";
import ResumePreview from "../../../components/ResumePreview2";
import TemplateSelector from "../../../components/TemplateSelector";
import { useCreateResumeFromForm } from "../../../lib/hooks/useResumes";
import type { ResumeFormData } from "../../../lib/services";

// Reusable nested schemas
const workExperienceSchema = yup.object({
  company: yup.string().required("Company is required"),
  position: yup.string().required("Position is required"),
  location: yup.string().default(""),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().default(""),
  isCurrent: yup.boolean().default(false),
  description: yup.string().default(""),
  technologies: yup.string().default(""),
});

const educationSchema = yup.object({
  institution: yup.string().required("Institution is required"),
  degree: yup.string().required("Degree is required"),
  fieldOfStudy: yup.string().default(""),
  location: yup.string().default(""),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().default(""),
  gpa: yup.string().default(""),
  description: yup.string().default(""),
});

const skillSchema = yup.object({
  name: yup.string().required("Skill name is required"),
  category: yup.string().default(""),
  level: yup.number().min(1).max(5).required("Level is required"),
  yearsExp: yup.number().default(0),
});

const languageSchema = yup.object({
  name: yup.string().required("Language name is required"),
  proficiency: yup.string().required("Proficiency is required"),
});

const certificationSchema = yup.object({
  name: yup.string().required("Certification name is required"),
  issuer: yup.string().default(""),
  issueDate: yup.string().default(""),
  expiryDate: yup.string().default(""),
  credentialID: yup.string().default(""),
  url: yup.string().default(""),
});

const projectSchema = yup.object({
  name: yup.string().required("Project name is required"),
  description: yup.string().default(""),
  technologies: yup.string().default(""),
  startDate: yup.string().default(""),
  endDate: yup.string().default(""),
  url: yup.string().default(""),
  github: yup.string().default(""),
});

// Final Resume Schema
export const ResumeSchema = yup.object({
  title: yup.string().required("Title is required"),
  isActive: yup.boolean().default(false).required("Active status is required"),
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().default(""),
  website: yup.string().default(""),
  linkedin: yup.string().default(""),
  github: yup.string().default(""),
  summary: yup.string().default(""),
  objective: yup.string().default(""),
  experience: yup.array().of(workExperienceSchema).min(1, "At least one experience is required").required(),
  education: yup.array().of(educationSchema).min(1, "At least one education is required").required(),
  skills: yup.array().of(skillSchema).min(1, "At least one skill is required").required(),
  languages: yup.array().of(languageSchema).min(1, "At least one language is required").required(),
  certifications: yup.array().of(certificationSchema).min(1, "At least one certification is required").required(),
  projects: yup.array().of(projectSchema).min(1, "At least one project is required").required(),
  awards: yup.string().default(""),
  interests: yup.string().default(""),
  references: yup.string().default(""),
  template: yup.string().default(""),
  theme: yup.string().default(""),
});

// Define the type explicitly to match the schema exactly
export type ResumeFormValues = yup.InferType<typeof ResumeSchema>;

// Default values to match the schema structure exactly
const defaultValues: ResumeFormValues = {
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
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const methods = useForm<ResumeFormValues>({
    resolver: yupResolver(ResumeSchema),
    defaultValues,
  });
  const watchAll = methods.watch();
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Dynamic fields
  const expArray = useFieldArray({ control: methods.control, name: "experience" });
  const eduArray = useFieldArray({ control: methods.control, name: "education" });
  const skillArray = useFieldArray({ control: methods.control, name: "skills" });
  const langArray = useFieldArray({ control: methods.control, name: "languages" });
  const certArray = useFieldArray({ control: methods.control, name: "certifications" });
  const projArray = useFieldArray({ control: methods.control, name: "projects" });

  // React Query mutation hook
  const createResumeMutation = useCreateResumeFromForm();

  const onSubmit = async (data: ResumeFormValues) => {
    try {
      // Use the new service method to create resume from form data
      // Note: You'll need to get the actual user ID from your auth context
      const userId = 1; // Replace with actual user ID from auth context
      
      await createResumeMutation.mutateAsync({
        formData: data as ResumeFormData,
        userId
      });
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Resume created successfully!'
      });

      // Redirect to resume list page after a short delay
      setTimeout(() => {
        navigate('/dashboard/resume/list');
      }, 1500);
      
    } catch (error) {
      console.error("Error creating resume:", error);
      // Show error notification
      setNotification({
        type: 'error',
        message: 'Failed to create resume. Please try again.'
      });
    }
  };

  // Clear notification after 5 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <Box maxWidth={1200} mx="auto" mt={4} mb={8}>
      {/* Notification */}
      {notification && (
        <Alert 
          severity={notification.type} 
          sx={{ mb: 3 }}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      {/* Mutation Error Alert */}
      {createResumeMutation.error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => createResumeMutation.reset()}
        >
          {createResumeMutation.error.message || 'Failed to create resume'}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid size={6}>
          {/* Existing form starts here */}
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
              {/* Basic Info */}
              <Card>
                <CardHeader title="Basic Info" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={6}><Input type="text" name="title" label="Resume Title" /></Grid>
                    <Grid size={6}><Input name="fullName" label="Full Name" type="text" /></Grid>
                    <Grid size={6}><Input name="email" label="Email" type="email" /></Grid>
                    <Grid size={6}><Input name="phone" label="Phone" type="text" /></Grid>
                    <Grid size={6}><Input name="address" label="Address" type="text" /></Grid>
                    <Grid size={6}><Input name="website" label="Website" type="text" /></Grid>
                    <Grid size={6}><Input name="linkedin" label="LinkedIn" type="text" /></Grid>
                    <Grid size={6}><Input name="github" label="GitHub" type="text" /></Grid>
                    <Grid size={12}><Input name="summary" label="Professional Summary" type="text" multiline rows={2} /></Grid>
                    <Grid size={12}><Input name="objective" label="Objective" type="text" multiline rows={2} /></Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader title="Experience" />
                <CardContent>
                  <Stack spacing={2}>
                    {expArray.fields.map((item, idx) => (
                      <Accordion key={item.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                            <Typography>
                              {methods.getValues(`experience.${idx}.company`) || "New Experience"}
                            </Typography>
                            <IconButton
                              onClick={e => { e.stopPropagation(); expArray.remove(idx); }}
                              color="error"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={6}><Input name={`experience.${idx}.company`} label="Company" type="text" /></Grid>
                            <Grid size={6}><Input name={`experience.${idx}.position`} label="Position" type="text" /></Grid>
                            <Grid size={6}><Input name={`experience.${idx}.location`} label="Location" type="text" /></Grid>
                            <Grid size={3}><Input name={`experience.${idx}.startDate`} label="Start Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid size={3}><Input name={`experience.${idx}.endDate`} label="End Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid size={6}><Input name={`experience.${idx}.description`} label="Description" type="text" multiline rows={2} /></Grid>
                            <Grid size={6}><Input name={`experience.${idx}.technologies`} label="Technologies (comma separated)" type="text" multiline rows={2} /></Grid>
                            <Grid size={3}><FormControlLabel control={<Checkbox {...methods.register(`experience.${idx}.isCurrent`)} />} label="Current Job" /></Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <Button startIcon={<Add />} onClick={() => expArray.append({ 
                      company: "", 
                      position: "", 
                      location: "", 
                      startDate: "", 
                      endDate: "", 
                      isCurrent: false, 
                      description: "", 
                      technologies: "" 
                    })}>
                      Add Experience
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader title="Education" />
                <CardContent>
                  <Stack spacing={2}>
                    {eduArray.fields.map((item, idx) => (
                      <Accordion key={item.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                            <Typography>
                              {methods.getValues(`education.${idx}.institution`) || "New Education"}
                            </Typography>
                            <IconButton
                              onClick={e => { e.stopPropagation(); eduArray.remove(idx); }}
                              color="error"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={6}><Input name={`education.${idx}.institution`} label="Institution" type="text" /></Grid>
                            <Grid size={6}><Input name={`education.${idx}.degree`} label="Degree" type="text" /></Grid>
                            <Grid size={6}><Input name={`education.${idx}.fieldOfStudy`} label="Field of Study" type="text" /></Grid>
                            <Grid size={6}><Input name={`education.${idx}.location`} label="Location" type="text" /></Grid>
                            <Grid size={3}><Input name={`education.${idx}.startDate`} label="Start Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid size={3}><Input name={`education.${idx}.endDate`} label="End Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid size={6}><Input name={`education.${idx}.gpa`} label="GPA" type="text" /></Grid>
                            <Grid size={12}><Input name={`education.${idx}.description`} label="Description" type="text" multiline rows={2} /></Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <Button startIcon={<Add />} onClick={() => eduArray.append({ 
                      institution: "", 
                      degree: "", 
                      fieldOfStudy: "", 
                      location: "", 
                      startDate: "", 
                      endDate: "", 
                      gpa: "", 
                      description: "" 
                    })}>
                      Add Education
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader title="Skills" />
                <CardContent>
                  <Stack spacing={2}>
                    {skillArray.fields.map((item, idx) => (
                      <Accordion key={item.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                            <Typography>
                              {methods.getValues(`skills.${idx}.name`) || "New Skill"}
                            </Typography>
                            <IconButton
                              onClick={e => { e.stopPropagation(); skillArray.remove(idx); }}
                              color="error"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={4}><Input name={`skills.${idx}.name`} label="Skill Name" type="text" /></Grid>
                            <Grid size={4}><Input name={`skills.${idx}.category`} label="Category" type="text" /></Grid>
                            <Grid size={2}><Input name={`skills.${idx}.level`} label="Level (1-5)" type="number" inputProps={{ min: 1, max: 5 }} /></Grid>
                            <Grid size={2}><Input name={`skills.${idx}.yearsExp`} label="Years Exp" type="number" /></Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <Button startIcon={<Add />} onClick={() => skillArray.append({ 
                      name: "", 
                      category: "", 
                      level: 3, 
                      yearsExp: 0 
                    })}>
                      Add Skill
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader title="Languages" />
                <CardContent>
                  <Stack spacing={2}>
                    {langArray.fields.map((item, idx) => (
                      <Accordion key={item.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                            <Typography>
                              {methods.getValues(`languages.${idx}.name`) || "New Language"}
                            </Typography>
                            <IconButton
                              onClick={e => { e.stopPropagation(); langArray.remove(idx); }}
                              color="error"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={6}><Input name={`languages.${idx}.name`} label="Language" type="text" /></Grid>
                            <Grid size={6}><Input name={`languages.${idx}.proficiency`} label="Proficiency" type="text" /></Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <Button startIcon={<Add />} onClick={() => langArray.append({ 
                      name: "", 
                      proficiency: "" 
                    })}>
                      Add Language
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader title="Certifications" />
                <CardContent>
                  <Stack spacing={2}>
                    {certArray.fields.map((item, idx) => (
                      <Accordion key={item.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                            <Typography>
                              {methods.getValues(`certifications.${idx}.name`) || "New Certification"}
                            </Typography>
                            <IconButton
                              onClick={e => { e.stopPropagation(); certArray.remove(idx); }}
                              color="error"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={4}><Input name={`certifications.${idx}.name`} label="Name" type="text" /></Grid>
                            <Grid size={4}><Input name={`certifications.${idx}.issuer`} label="Issuer" type="text" /></Grid>
                            <Grid size={2}><Input name={`certifications.${idx}.issueDate`} label="Issue Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid size={2}><Input name={`certifications.${idx}.expiryDate`} label="Expiry Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid size={4}><Input name={`certifications.${idx}.credentialID`} label="Credential ID" type="text" /></Grid>
                            <Grid size={4}><Input name={`certifications.${idx}.url`} label="URL" type="text" /></Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <Button startIcon={<Add />} onClick={() => certArray.append({ 
                      name: "", 
                      issuer: "", 
                      issueDate: "", 
                      expiryDate: "", 
                      credentialID: "", 
                      url: "" 
                    })}>
                      Add Certification
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader title="Projects" />
                <CardContent>
                  <Stack spacing={2}>
                    {projArray.fields.map((item, idx) => (
                      <Accordion key={item.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                            <Typography>
                              {methods.getValues(`projects.${idx}.name`) || "New Project"}
                            </Typography>
                            <IconButton
                              onClick={e => { e.stopPropagation(); projArray.remove(idx); }}
                              color="error"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={4}><Input name={`projects.${idx}.name`} label="Project Name" type="text" /></Grid>
                            <Grid size={4}><Input name={`projects.${idx}.description`} label="Description" type="text" /></Grid>
                            <Grid size={4}><Input name={`projects.${idx}.technologies`} label="Technologies (comma separated)" type="text" /></Grid>
                            <Grid size={3}><Input name={`projects.${idx}.startDate`} label="Start Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid size={3}><Input name={`projects.${idx}.endDate`} label="End Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid size={3}><Input name={`projects.${idx}.url`} label="URL" type="text" /></Grid>
                            <Grid size={3}><Input name={`projects.${idx}.github`} label="GitHub" type="text" /></Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <Button startIcon={<Add />} onClick={() => projArray.append({ 
                      name: "", 
                      description: "", 
                      technologies: "", 
                      startDate: "", 
                      endDate: "", 
                      url: "", 
                      github: "" 
                    })}>
                      Add Project
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Other Sections */}
              <Card>
                <CardHeader title="Other Sections" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={4}><Input name="awards" label="Awards" type="text" multiline rows={2} /></Grid>
                    <Grid size={4}><Input name="interests" label="Interests" type="text" multiline rows={2} /></Grid>
                    <Grid size={4}><Input name="references" label="References" type="text" multiline rows={2} /></Grid>
                    <Grid size={6}><Input name="template" label="Template" type="text" /></Grid>
                    <Grid size={6}><Input name="theme" label="Theme" type="text" /></Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={createResumeMutation.isPending}
                startIcon={createResumeMutation.isPending ? <CircularProgress size={20} color="inherit" /> : undefined}
              >
                {createResumeMutation.isPending ? 'Creating Resume...' : 'Create Resume'}
              </Button>
            </Stack>
          </FormProvider>
          <Button variant="contained" sx={{ mt: 2 }}>
            Download PDF
          </Button>
        </Grid>
        <Grid size={6}>
          <Stack marginBottom={2}>
            <Typography variant="h6" gutterBottom>
              Select a Template
            </Typography>
            <Controller
              name="theme"
              control={methods.control}
              defaultValue={watchAll.theme || 'light'}
              render={({ field }) => (
                <TemplateSelector
                  selected={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
          </Stack>
          <Card ref={previewRef}
            sx={{
              position: 'sticky',
              maxHeight: 'calc(100vh - 48px)',
              top: '24px',
              bottom: '24px',
              overflowY: 'auto',
            }}
          >
            <ResumePreview
              data={watchAll}
              theme={watchAll.theme}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateResume;