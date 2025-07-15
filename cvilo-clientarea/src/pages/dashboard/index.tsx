import PageContent from '../../components/Page'
import MultiPageResumePreview from '../../components/MultiPageResumePreview';
import ChatHistoryButton from '../../components/ChatHistoryButton';
import { resumeKeys, useResume } from '../../lib/hooks/useResumes';
import type { ResumeFormValues } from './resume/components/ResumeForm';
import { convertResumeToFormValues } from "../../lib/utils/resumeConverter";
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Button, 
  Stack, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Card, 
  CardContent, 
  Chip, 
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send, AutoAwesome, Edit, Add } from '@mui/icons-material';
import { useState } from 'react';
import { useUser } from '../../stores/authStore';
import { aiService } from '../../lib/services/ai.service';
import { useQueryClient } from '@tanstack/react-query';

// Industry/Role options
const INDUSTRY_OPTIONS = [
  { value: 'backend-developer', label: 'Backend Developer', description: 'Server-side development, APIs, databases' },
  { value: 'frontend-developer', label: 'Frontend Developer', description: 'Client-side development, UI/UX, web applications' },
  { value: 'fullstack-developer', label: 'Full Stack Developer', description: 'Both frontend and backend development' },
  { value: 'devops-engineer', label: 'DevOps Engineer', description: 'Infrastructure, CI/CD, cloud platforms' },
  { value: 'data-engineer', label: 'Data Engineer', description: 'Data pipelines, ETL, big data technologies' },
  { value: 'database-engineer', label: 'Database Engineer', description: 'Database design, optimization, administration' },
  { value: 'software-engineer', label: 'Software Engineer', description: 'General software development' },
  { value: 'mobile-developer', label: 'Mobile Developer', description: 'iOS/Android app development' },
  { value: 'ui-ux-designer', label: 'UI/UX Designer', description: 'User interface and experience design' },
  { value: 'product-manager', label: 'Product Manager', description: 'Product strategy, roadmap, stakeholder management' },
  { value: 'project-manager', label: 'Project Manager', description: 'Project planning, execution, team leadership' },
  { value: 'business-analyst', label: 'Business Analyst', description: 'Requirements analysis, process improvement' },
  { value: 'data-scientist', label: 'Data Scientist', description: 'Data analysis, machine learning, statistics' },
  { value: 'qa-engineer', label: 'QA Engineer', description: 'Quality assurance, testing, automation' },
  { value: 'system-administrator', label: 'System Administrator', description: 'IT infrastructure, system maintenance' },
  { value: 'network-engineer', label: 'Network Engineer', description: 'Network design, security, troubleshooting' },
  { value: 'cybersecurity-analyst', label: 'Cybersecurity Analyst', description: 'Security assessment, threat analysis' },
  { value: 'sales-representative', label: 'Sales Representative', description: 'Customer acquisition, relationship management' },
  { value: 'marketing-specialist', label: 'Marketing Specialist', description: 'Digital marketing, campaigns, analytics' },
  { value: 'customer-support', label: 'Customer Support', description: 'Customer service, problem resolution' },
  { value: 'human-resources', label: 'Human Resources', description: 'Recruitment, employee relations, HR operations' },
  { value: 'finance-analyst', label: 'Finance Analyst', description: 'Financial analysis, reporting, budgeting' },
  { value: 'legal-assistant', label: 'Legal Assistant', description: 'Legal research, document preparation' },
  { value: 'healthcare-professional', label: 'Healthcare Professional', description: 'Medical, nursing, healthcare administration' },
  { value: 'education-professional', label: 'Education Professional', description: 'Teaching, curriculum development' },
  { value: 'consultant', label: 'Consultant', description: 'Business consulting, strategy, advisory services' },
  { value: 'entrepreneur', label: 'Entrepreneur', description: 'Business ownership, startup management' },
  { value: 'freelancer', label: 'Freelancer', description: 'Independent contractor, multiple clients' },
  { value: 'other', label: 'Other', description: 'Custom role or industry' }
];


// Prompt suggestions based on industry
const PROMPT_SUGGESTIONS = {
  'backend-developer': [
    'Create a backend developer resume with 5 years of experience in Node.js, Python, and PostgreSQL',
    'Generate a senior backend engineer resume with microservices and cloud experience',
    'Build a backend developer resume focused on API development and database optimization'
  ],
  'frontend-developer': [
    'Create a frontend developer resume with React, TypeScript, and modern CSS experience',
    'Generate a UI developer resume with responsive design and accessibility expertise',
    'Build a frontend engineer resume with Vue.js, state management, and performance optimization'
  ],
  'fullstack-developer': [
    'Create a full stack developer resume with MERN stack and cloud deployment experience',
    'Generate a full stack engineer resume with React, Node.js, and AWS expertise',
    'Build a full stack developer resume with modern web technologies and DevOps skills'
  ],
  'devops-engineer': [
    'Create a DevOps engineer resume with Docker, Kubernetes, and CI/CD pipeline experience',
    'Generate a cloud engineer resume with AWS, Terraform, and infrastructure automation',
    'Build a DevOps specialist resume with monitoring, logging, and security expertise'
  ],
  'data-engineer': [
    'Create a data engineer resume with ETL pipelines, Apache Spark, and data warehousing',
    'Generate a big data engineer resume with Hadoop, Kafka, and real-time processing',
    'Build a data pipeline engineer resume with Python, SQL, and cloud data platforms'
  ]
};

export default function Dashboard() {
  const { id } = useParams();
  const { data: response } = useResume(Number(id));
  const navigate = useNavigate();
  const user = useUser();
  const queryClient = useQueryClient();
  
  // State for AI prompt interface
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // Convert API response to form values
  const formData: ResumeFormValues | undefined = response?.data?.resume && convertResumeToFormValues(response?.data?.resume);

  const handleGenerateResume = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (!promptText.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const requestBody = {
        prompt: promptText,
        user_id: user.id,
        ...(id && { resume_id: Number(id) })
      };

      let response;
      if (id) {
        // Update existing resume
        response = await aiService.updateResume(requestBody);
      } else {
        // Generate new resume
        response = await aiService.generateResume(requestBody);
      }

      if (response.code === 200) {
        // Refresh the page to show the new/updated resume
        queryClient.invalidateQueries({ queryKey: resumeKeys.detail(Number(id)) });
      } else {
        setError(response.data?.error || 'Failed to generate resume');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPromptText(suggestion);
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    // Clear prompt when industry changes
    setPromptText('');
  };

  if (!formData) {
    return (
      <PageContent>
        <Stack gap={3} alignItems="center" justifyContent="center" height="100%">
          <Typography variant="h4" textAlign="center">
            Create Your First Resume
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary">
            Use AI to generate a professional resume tailored to your industry and experience
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<Add />}
            onClick={() => navigate('/dashboard/resume/create')}
          >
            Create New Resume
          </Button>
        </Stack>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={3} height="100%">
        {/* AI Generator Panel */}
        <Stack width={{ xs: '100%', md: '35%' }} gap={3}>
          <Card>
            <CardContent>
              <Stack gap={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                    <AutoAwesome color="primary" />
                    AI Resume Generator
                  </Typography>
                  
                  {/* Chat History Button */}
                  {id && (
                    <ChatHistoryButton
                      resumeId={Number(id)}
                      onReusePrompt={setPromptText}
                      onEditPrompt={(history) => {
                        setPromptText(history.prompt);
                        // You could add additional logic here to pre-fill other fields
                      }}
                      variant="icon"
                      size="small"
                    />
                  )}
                </Box>
                
                {/* Industry Selection */}
                <FormControl fullWidth>
                  <InputLabel>Select Industry/Role</InputLabel>
                  <Select
                    value={selectedIndustry}
                    label="Select Industry/Role"
                    onChange={(e) => handleIndustryChange(e.target.value)}
                  >
                    {INDUSTRY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Stack>
                          <Typography variant="body1">{option.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Prompt Input */}
                <TextField
                  label="Describe your resume requirements"
                  multiline
                  rows={4}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g., Create a backend developer resume with 5 years of experience in Node.js, Python, and PostgreSQL. Include experience with microservices, cloud platforms, and database optimization."
                  fullWidth
                />

                {/* Prompt Suggestions */}
                {selectedIndustry && PROMPT_SUGGESTIONS[selectedIndustry as keyof typeof PROMPT_SUGGESTIONS] && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Suggested prompts:
                    </Typography>
                    <Stack gap={1}>
                      {PROMPT_SUGGESTIONS[selectedIndustry as keyof typeof PROMPT_SUGGESTIONS].map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          variant="outlined"
                          size="small"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Error Display */}
                {error && (
                  <Alert severity="error" onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {/* Action Buttons */}
                <Stack direction="row" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={isGenerating ? <CircularProgress size={20} /> : <Send />}
                    onClick={handleGenerateResume}
                    disabled={isGenerating || !promptText.trim()}
                    fullWidth
                  >
                    {isGenerating ? 'Generating...' : id ? 'Update Resume' : 'Generate Resume'}
                  </Button>
                  
                  {id && (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/dashboard/resume/${id}/edit`)}
                    >
                      Edit Manually
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>💡 Tips for Better Results</Typography>
              <Stack gap={1}>
                <Typography variant="body2">• Be specific about your experience level and years</Typography>
                <Typography variant="body2">• Mention key technologies and tools you use</Typography>
                <Typography variant="body2">• Include any certifications or specializations</Typography>
                <Typography variant="body2">• Specify if you want to focus on certain achievements</Typography>
                <Typography variant="body2">• Mention target companies or industries if relevant</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Resume Preview Panel */}
        <Stack width={{ xs: '100%', md: '65%' }} gap={2}>
          {formData && <MultiPageResumePreview data={formData} />}
        </Stack>
      </Stack>
    </PageContent>
  );
} 