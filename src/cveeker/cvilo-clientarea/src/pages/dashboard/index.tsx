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
} from '@mui/material'
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import PageContent from '../../components/Page'
import { useUser } from '../../stores'

const stats = [
    {
      title: 'Total Resumes',
      value: '3',
      icon: <DescriptionIcon />,
      color: '#1976d2',
      change: '+2 this month',
    },
    {
      title: 'Profile Views',
      value: '127',
      icon: <VisibilityIcon />,
      color: '#9c27b0',
      change: '+15 this week',
    },
    {
      title: 'Downloads',
      value: '45',
      icon: <DownloadIcon />,
      color: '#2e7d32',
      change: '+8 this week',
    },
    {
      title: 'Success Rate',
      value: '85%',
      icon: <TrendingUpIcon />,
      color: '#ed6c02',
      change: '+5% improvement',
    },
]

const recentResumes = [
    {
      id: 1,
      title: 'Software Engineer Resume',
      lastModified: '2 days ago',
      status: 'Active',
      views: 24,
    },
    {
      id: 2,
      title: 'Frontend Developer CV',
      lastModified: '1 week ago',
      status: 'Draft',
      views: 12,
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      lastModified: '2 weeks ago',
      status: 'Active',
      views: 31,
    },
  ]

export default function Dashboard() {
  const user = useUser();

  return (
    <PageContent>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {/* show user name from auth store */}
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Here's an overview of your resume performance and recent activity.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Create New Resume
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: stat.color,
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="success.main">
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Resumes */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Resumes
              </Typography>
              <Box sx={{ mt: 2 }}>
                {recentResumes.map((resume) => (
                  <Box
                    key={resume.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <DescriptionIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {resume.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last modified {resume.lastModified}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {resume.views} views
                      </Typography>
                      <Chip
                        label={resume.status}
                        size="small"
                        color={resume.status === 'Active' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              <Button
                variant="text"
                sx={{ mt: 2, textTransform: 'none' }}
                fullWidth
              >
                View All Resumes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Profile Completion */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Profile Completion */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Profile Completion
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Complete your profile</Typography>
                    <Typography variant="body2" color="primary">
                      85%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Add your skills and experience to improve your profile visibility
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    Download Latest Resume
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    Share Resume Link
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    View Analytics
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </PageContent>
  )
} 