import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material'
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import PageContent from '../../components/Page'
import { useUser } from '../../stores'

const stats = [
  {
    title: 'Total Resumes',
    value: '3',
    icon: <DescriptionIcon />,
    color: '#10a37f',
    change: '+2 this month',
    trend: 'up',
  },
  {
    title: 'Profile Views',
    value: '127',
    icon: <VisibilityIcon />,
    color: '#8b5cf6',
    change: '+15 this week',
    trend: 'up',
  },
  {
    title: 'Downloads',
    value: '45',
    icon: <DownloadIcon />,
    color: '#06b6d4',
    change: '+8 this week',
    trend: 'up',
  },
  {
    title: 'Success Rate',
    value: '85%',
    icon: <TrendingUpIcon />,
    color: '#10b981',
    change: '+5% improvement',
    trend: 'up',
  },
]

const quickActions = [
  {
    title: 'Create New Resume',
    description: 'Start building your professional resume',
    icon: <AddIcon />,
    color: '#10a37f',
    path: '/dashboard/resume/create',
  },
  {
    title: 'Edit Profile',
    description: 'Update your personal information',
    icon: <PersonIcon />,
    color: '#8b5cf6',
    path: '/dashboard/settings',
  },
  {
    title: 'View Analytics',
    description: 'Check your resume performance',
    icon: <AnalyticsIcon />,
    color: '#06b6d4',
    path: '/dashboard/analytics',
  },
  {
    title: 'Settings',
    description: 'Manage your account preferences',
    icon: <SettingsIcon />,
    color: '#6b7280',
    path: '/dashboard/settings',
  },
]

const profileSections = [
  {
    title: 'Work Experience',
    description: 'Add your professional experience',
    icon: <WorkIcon />,
    color: '#10a37f',
    completed: 85,
  },
  {
    title: 'Education',
    description: 'Include your academic background',
    icon: <SchoolIcon />,
    color: '#8b5cf6',
    completed: 90,
  },
  {
    title: 'Skills',
    description: 'Showcase your technical skills',
    icon: <CodeIcon />,
    color: '#06b6d4',
    completed: 75,
  },
  {
    title: 'Certifications',
    description: 'Add professional certifications',
    icon: <StarIcon />,
    color: '#10b981',
    completed: 60,
  },
]

export default function Dashboard() {
  const user = useUser();
  const navigate = useNavigate();

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  return (
    <PageContent>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome back, {user?.name}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              Here's what's happening with your resumes today
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/resume/create')}
            sx={{
              background: 'linear-gradient(135deg, #10a37f 0%, #1a7f64 100%)',
              px: 3,
              py: 1.5,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Create Resume
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #161b22 0%, #1f2937 100%)',
              border: '1px solid #30363d',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: stat.color,
                boxShadow: `0 8px 25px rgba(0, 0, 0, 0.3)`,
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: stat.color,
                      width: 48,
                      height: 48,
                      fontSize: '1.25rem',
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: stat.trend === 'up' ? 'rgba(16, 163, 127, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: stat.trend === 'up' ? '#10a37f' : '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, fontSize: '2rem' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #161b22 0%, #1f2937 100%)',
            border: '1px solid #30363d',
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #30363d' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Quick Actions
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={action.icon}
                        onClick={() => handleQuickAction(action.path)}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          p: 2,
                          height: 'auto',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          borderColor: '#30363d',
                          '&:hover': {
                            borderColor: action.color,
                            bgcolor: `${action.color}08`,
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'left' }}>
                          {action.description}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Completion */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #161b22 0%, #1f2937 100%)',
            border: '1px solid #30363d',
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #30363d' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Profile Completion
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Complete your profile
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10a37f', fontWeight: 600 }}>
                    85%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#30363d',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#10a37f',
                      borderRadius: 4,
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', lineHeight: 1.4 }}>
                  Add your skills and experience to improve your profile visibility and get better job matches
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/dashboard/settings')}
                  sx={{ 
                    mt: 2,
                    textTransform: 'none',
                    borderColor: '#10a37f',
                    color: '#10a37f',
                    '&:hover': {
                      bgcolor: 'rgba(16, 163, 127, 0.08)',
                    }
                  }}
                >
                  Complete Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Sections */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #161b22 0%, #1f2937 100%)',
            border: '1px solid #30363d',
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #30363d' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Profile Sections
                </Typography>
              </Box>
              <Box>
                {profileSections.map((section, index) => (
                  <Box key={section.title}>
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Avatar 
                          sx={{ 
                            mr: 3, 
                            bgcolor: section.color,
                            width: 40,
                            height: 40,
                            fontSize: '0.875rem',
                          }}
                        >
                          {section.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {section.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {section.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={section.completed}
                              sx={{ 
                                flex: 1,
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: '#30363d',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: section.color,
                                  borderRadius: 3,
                                }
                              }}
                            />
                            <Typography variant="caption" sx={{ color: section.color, fontWeight: 600 }}>
                              {section.completed}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/dashboard/settings')}
                        sx={{
                          borderColor: section.color,
                          color: section.color,
                          '&:hover': {
                            bgcolor: `${section.color}08`,
                          }
                        }}
                      >
                        Update
                      </Button>
                    </Box>
                    {index < profileSections.length - 1 && <Divider sx={{ borderColor: '#30363d' }} />}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContent>
  )
} 