import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Button,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon as MenuListItemIcon,
  Skeleton,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CloneIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResumes, useDeleteResume, useToggleResumeStatus, useCloneResume } from '../lib/hooks/useResumes';
import type { Resume } from '../lib/services';

interface ResumeSidebarProps {
  onResumeSelect?: (resume: Resume) => void;
}

const ResumeSidebar: React.FC<ResumeSidebarProps> = ({ onResumeSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeResumeId, setActiveResumeId] = useState<number | null>(null);

  // React Query hooks
  const { data: response, isLoading, error } = useResumes({
    page: 1,
    limit: 50, // Get more resumes for sidebar
  });
  
  const deleteResumeMutation = useDeleteResume();
  const toggleStatusMutation = useToggleResumeStatus();
  const cloneResumeMutation = useCloneResume();

  const resumes = response?.data?.resumes || [];

  const handleResumeClick = (resume: Resume) => {
    if (onResumeSelect) {
      onResumeSelect(resume);
    }
    navigate(`/dashboard/${resume.id}`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, resume: Resume) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveResumeId(resume.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveResumeId(null);
  };

  const handleEdit = (resume: Resume) => {
    handleMenuClose();
    navigate(`/dashboard/resume/${resume.id}/edit`);
  };

  const handleView = (resume: Resume) => {
    handleMenuClose();
    navigate(`/dashboard/resume/${resume.id}/preview`);
  };

  const handleClone = async (resume: Resume) => {
    handleMenuClose();
    try {
      await cloneResumeMutation.mutateAsync(resume.id);
    } catch (err) {
      console.error('Error cloning resume:', err);
    }
  };

  const handleToggleStatus = async (resume: Resume) => {
    handleMenuClose();
    try {
      await toggleStatusMutation.mutateAsync(resume.id);
    } catch (err) {
      console.error('Error updating resume status:', err);
    }
  };

  const handleDelete = async (resume: Resume) => {
    handleMenuClose();
    try {
      await deleteResumeMutation.mutateAsync(resume.id);
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const getResumeInitials = (title: string) => {
    return title
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f0f6fc' }}>
          My Resumes
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f0f6fc' }}>
          My Resumes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Failed to load resumes
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #30363d' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#f0f6fc' }}>
            My Resumes
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/resume/create')}
            sx={{
              borderColor: '#10a37f',
              color: '#10a37f',
              '&:hover': {
                bgcolor: 'rgba(16, 163, 127, 0.08)',
              }
            }}
          >
            New
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Resume List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {resumes.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <DescriptionIcon sx={{ fontSize: 48, color: '#6b7280', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No resumes yet
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/dashboard/resume/create')}
              sx={{
                borderColor: '#10a37f',
                color: '#10a37f',
                '&:hover': {
                  bgcolor: 'rgba(16, 163, 127, 0.08)',
                }
              }}
            >
              Create your first resume
            </Button>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {resumes.map((resume, index) => {
              const isSelected = location.pathname.includes(`/resume/${resume.id}`);
              const initials = getResumeInitials(resume.title);
              
              return (
                <React.Fragment key={resume.id}>
                  <ListItem sx={{ p: 0 }}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleResumeClick(resume)}
                      sx={{
                        borderRadius: 0,
                        py: 2,
                        px: 3,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(16, 163, 127, 0.1)',
                          color: '#10a37f',
                          '&:hover': {
                            backgroundColor: 'rgba(16, 163, 127, 0.15)',
                          },
                          '& .MuiListItemIcon-root': {
                            color: '#10a37f',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: resume.is_active ? '#10a37f' : '#6b7280',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {initials}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isSelected ? 600 : 500,
                                fontSize: '0.875rem',
                                lineHeight: 1.4,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {resume.title}
                            </Typography>
                            {!resume.is_active && (
                              <Chip
                                label="Draft"
                                size="small"
                                sx={{
                                  height: 16,
                                  fontSize: '0.625rem',
                                  bgcolor: 'rgba(107, 114, 128, 0.1)',
                                  color: '#6b7280',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontSize: '0.75rem',
                              lineHeight: 1.3,
                            }}
                          >
                            {formatDate(resume.updated_at)}
                          </Typography>
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, resume)}
                        sx={{
                          color: '#6b7280',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.04)',
                          }
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                  {index < resumes.length - 1 && (
                    <Divider sx={{ borderColor: '#30363d', mx: 3 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>

      {/* Resume Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.3))',
            mt: 1.5,
            bgcolor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 2,
            '& .MuiMenuItem-root': {
              color: '#f0f6fc',
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.04)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {activeResumeId && (
          <>
            <MenuItem onClick={() => handleView(resumes.find(r => r.id === activeResumeId)!)}>
              <MenuListItemIcon>
                <ViewIcon fontSize="small" sx={{ color: '#8b949e' }} />
              </MenuListItemIcon>
              View
            </MenuItem>
            <MenuItem onClick={() => handleEdit(resumes.find(r => r.id === activeResumeId)!)}>
              <MenuListItemIcon>
                <EditIcon fontSize="small" sx={{ color: '#8b949e' }} />
              </MenuListItemIcon>
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleClone(resumes.find(r => r.id === activeResumeId)!)}>
              <MenuListItemIcon>
                <CloneIcon fontSize="small" sx={{ color: '#8b949e' }} />
              </MenuListItemIcon>
              Clone
            </MenuItem>
            <MenuItem onClick={() => handleToggleStatus(resumes.find(r => r.id === activeResumeId)!)}>
              <MenuListItemIcon>
                <DownloadIcon fontSize="small" sx={{ color: '#8b949e' }} />
              </MenuListItemIcon>
              {resumes.find(r => r.id === activeResumeId)?.is_active ? 'Deactivate' : 'Activate'}
            </MenuItem>
            <Divider sx={{ borderColor: '#30363d', my: 1 }} />
            <MenuItem 
              onClick={() => handleDelete(resumes.find(r => r.id === activeResumeId)!)}
              sx={{ color: '#ef4444' }}
            >
              <MenuListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
              </MenuListItemIcon>
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default ResumeSidebar; 