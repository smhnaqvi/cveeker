import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import { resumeThemes, getThemesByCategory } from '../lib/theme/resumeThemes';
import type { ResumeFormValues } from '../pages/dashboard/resume/components/ResumeForm';
import ResumePreview from './ResumePreview2';

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
  sampleData?: ResumeFormValues;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelectTheme,
  sampleData,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'modern' | 'classic' | 'creative' | 'minimalist'>('modern');
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const categories = [
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' },
    { value: 'creative', label: 'Creative' },
    { value: 'minimalist', label: 'Minimalist' },
  ] as const;

  const themesInCategory = getThemesByCategory(selectedCategory);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPreviewTheme(null);
  };

  const handleThemeSelect = (themeId: string) => {
    onSelectTheme(themeId);
    handleClose();
  };

  const handlePreviewTheme = (themeId: string) => {
    setPreviewTheme(themeId);
  };

  const selectedThemeData = resumeThemes.find(theme => theme.id === selectedTheme);

  // Default sample data for preview
  const defaultSampleData: ResumeFormValues = {
    id: "sample",
    title: "Sample Resume",
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
      { name: "JavaScript", category: "Programming", level: 5, yearsExp: 7 },
      { name: "React", category: "Frontend", level: 4, yearsExp: 5 },
      { name: "Node.js", category: "Backend", level: 4, yearsExp: 6 }
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Spanish", proficiency: "Intermediate" }
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

  const dataToUse = sampleData || defaultSampleData;

  return (
    <>
      {/* Current Theme Display */}
      <Card 
        sx={{ 
          cursor: 'pointer',
          border: '2px solid',
          borderColor: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
          }
        }}
        onClick={handleOpen}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1" fontWeight="600">
                {selectedThemeData?.name || 'Select Theme'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedThemeData?.description || 'Choose a theme for your resume'}
              </Typography>
            </Box>
            <Chip 
              label={selectedThemeData?.category || 'Theme'} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Theme Selection Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="600">
            Choose Resume Theme
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select a theme that best represents your professional style
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Theme List */}
            <Box sx={{ width: '40%', borderRight: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedCategory}
                onChange={(_, newValue) => setSelectedCategory(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                {categories.map((category) => (
                  <Tab
                    key={category.value}
                    label={category.label}
                    value={category.value}
                    sx={{ textTransform: 'none' }}
                  />
                ))}
              </Tabs>

              <Box sx={{ p: 2, overflowY: 'auto', maxHeight: 'calc(90vh - 200px)' }}>
                <Grid container spacing={2}>
                  {themesInCategory.map((theme) => (
                    <Grid size={12} key={theme.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: selectedTheme === theme.id ? 'primary.main' : 'transparent',
                          '&:hover': {
                            borderColor: 'primary.light',
                          },
                        }}
                        onClick={() => handlePreviewTheme(theme.id)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600">
                                {theme.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {theme.description}
                              </Typography>
                            </Box>
                            <Chip 
                              label={theme.category} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* Theme Preview */}
            <Box sx={{ width: '60%', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              {previewTheme ? (
                <Box sx={{ height: 'calc(90vh - 200px)', overflowY: 'auto' }}>
                  <ResumePreview 
                    data={dataToUse} 
                    theme={previewTheme} 
                  />
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    height: 'calc(90vh - 200px)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography color="text.secondary">
                    Select a theme to see preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          {previewTheme && (
            <Button 
              variant="contained" 
              onClick={() => handleThemeSelect(previewTheme)}
            >
              Use This Theme
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ThemeSelector; 