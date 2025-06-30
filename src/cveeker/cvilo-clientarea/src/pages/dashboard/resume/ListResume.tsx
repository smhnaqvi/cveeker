import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  Chip, 
  IconButton, 
  Stack, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Pagination,
  FormControlLabel,
  Switch,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CloneIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useResumes, useDeleteResume, useToggleResumeStatus, useCloneResume } from '../../../lib/hooks/useResumes';
import type { Resume } from '../../../lib/services';
import PageContent from '../../../components/Page';

const ListResume = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);

  // React Query hooks
  const { data: response, isLoading, error, refetch } = useResumes({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    is_active: showActiveOnly ? true : undefined
  });
    
  const deleteResumeMutation = useDeleteResume();
  const toggleStatusMutation = useToggleResumeStatus();
    const cloneResumeMutation = useCloneResume();


  const resumes = response?.data?.resumes || [];
  const pagination = response?.data?.pagination || {
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  };

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Handle resume actions
  const handleEdit = (resume: Resume) => {
    navigate(`/dashboard/resume/${resume.id}/edit`);
  };

  const handleView = (resume: Resume) => {
    navigate(`/dashboard/resume/${resume.id}/preview`);
  };

  const handleClone = async (resume: Resume) => {
    try {
      await cloneResumeMutation.mutateAsync(resume.id);
    } catch (err) {
      console.error('Error cloning resume:', err);
    }
  };

  const handleToggleStatus = async (resume: Resume) => {
    try {
      await toggleStatusMutation.mutateAsync(resume.id);
    } catch (err) {
      console.error('Error updating resume status:', err);
    }
  };

  const handleDelete = async () => {
    if (!resumeToDelete) return;

    try {
      await deleteResumeMutation.mutateAsync(resumeToDelete.id);
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  const openDeleteDialog = (resume: Resume) => {
    setResumeToDelete(resume);
    setDeleteDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get experience summary
  const getExperienceSummary = (experienceJson: string) => {
    try {
      const experience = JSON.parse(experienceJson);
      if (Array.isArray(experience) && experience.length > 0) {
        return `${experience.length} position${experience.length > 1 ? 's' : ''}`;
      }
      return 'No experience';
    } catch {
      return 'No experience';
    }
  };

  // Get skills summary
  const getSkillsSummary = (skillsJson: string) => {
    try {
      const skills = JSON.parse(skillsJson);
      if (Array.isArray(skills) && skills.length > 0) {
        return skills.slice(0, 3).map((s: { name: string }) => s.name).join(', ');
      }
      return 'No skills';
    } catch {
      return 'No skills';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContent>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Resumes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/resume/create')}
        >
          Create New Resume
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => refetch()}>
          {error.message || 'Failed to fetch resumes'}
        </Alert>
      )}

      {/* Mutation Error Alerts */}
      {deleteResumeMutation.error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => deleteResumeMutation.reset()}>
          {deleteResumeMutation.error.message || 'Failed to delete resume'}
        </Alert>
      )}

      {toggleStatusMutation.error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => toggleStatusMutation.reset()}>
          {toggleStatusMutation.error.message || 'Failed to update resume status'}
        </Alert>
      )}

      {cloneResumeMutation.error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => cloneResumeMutation.reset()}>
          {cloneResumeMutation.error.message || 'Failed to clone resume'}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={6}>
              <TextField
                fullWidth
                placeholder="Search resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={showActiveOnly}
                      onChange={(e) => setShowActiveOnly(e.target.checked)}
                    />
                  }
                  label="Active only"
                />
                <Typography variant="body2" color="text.secondary">
                  {pagination.total} resume{pagination.total !== 1 ? 's' : ''} total
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Resume List */}
      {resumes.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No resumes found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {searchTerm || showActiveOnly 
                ? 'Try adjusting your search or filters'
                : 'Create your first resume to get started'
              }
            </Typography>
            {!searchTerm && !showActiveOnly && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/resume/create')}
              >
                Create Your First Resume
              </Button>
            )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {resumes.map((resume) => (
            <Grid size={4} key={resume.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                {/* Status Badge */}
                <Box position="absolute" top={12} right={12} zIndex={1}>
                  <Chip
                    label={resume.is_active ? 'Active' : 'Inactive'}
                    color={resume.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 6 }}>
                  {/* Resume Title */}
                  <Typography variant="h6" component="h2" gutterBottom>
                    {resume.title}
                  </Typography>

                  {/* Basic Info */}
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {resume.full_name} • {resume.email}
                  </Typography>

                  {/* Summary */}
                  {resume.summary && (
                    <Typography variant="body2" sx={{ mb: 2 }} noWrap>
                      {resume.summary}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Stats */}
                  <Stack direction="row" spacing={2} mb={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body2">
                        {getExperienceSummary(resume.experience)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Skills
                      </Typography>
                      <Typography variant="body2" noWrap>
                        {getSkillsSummary(resume.skills)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Template Info */}
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      Template:
                    </Typography>
                    <Chip label={resume.template} size="small" variant="outlined" />
                  </Box>

                  {/* Last Updated */}
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {formatDate(resume.updated_at)}
                  </Typography>
                </CardContent>

                {/* Actions */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(resume)}
                        title="View"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(resume)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleClone(resume)}
                        title="Clone"
                        disabled={cloneResumeMutation.isPending}
                      >
                        <CloneIcon />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleStatus(resume)}
                        title={resume.is_active ? 'Deactivate' : 'Activate'}
                        disabled={toggleStatusMutation.isPending}
                      >
                        <Switch
                          size="small"
                          checked={resume.is_active}
                          onChange={() => handleToggleStatus(resume)}
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(resume)}
                        title="Delete"
                        disabled={deleteResumeMutation.isPending}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{resumeToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteResumeMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={deleteResumeMutation.isPending}
          >
            {deleteResumeMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContent>
  );
};

export default ListResume;