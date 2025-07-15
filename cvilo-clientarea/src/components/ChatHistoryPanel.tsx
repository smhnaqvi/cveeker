import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Divider,
  Tooltip,
  Alert,
  CircularProgress,
  Collapse,
  Badge
} from '@mui/material';
import {
  History,
  Send,
  Delete,
  ContentCopy,
  ExpandMore,
  ExpandLess,
  Search,
  FilterList,
  Refresh,
  AutoAwesome,
  CheckCircle,
  Error,
  Schedule
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useRecentChatHistory, useDeleteChatHistory } from '../lib/hooks/useChatHistory';
import type { ChatPromptHistory } from '../lib/services';

interface ChatHistoryPanelProps {
  resumeId: number;
  onReusePrompt: (prompt: string) => void;
  onEditPrompt?: (history: ChatPromptHistory) => void;
}

export default function ChatHistoryPanel({ 
  resumeId, 
  onReusePrompt, 
  onEditPrompt 
}: ChatHistoryPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const { data: chatHistory, isLoading, error, refetch } = useRecentChatHistory(resumeId, 20);
  const deleteChatHistory = useDeleteChatHistory();

  // Filter and search chat history
  const filteredHistory = useMemo(() => {
    if (!chatHistory?.data?.history) return [];
    
    return chatHistory.data.history.filter((item) => {
      const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.response.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesProvider = providerFilter === 'all' || item.provider === providerFilter;
      
      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [chatHistory?.data?.history, searchTerm, statusFilter, providerFilter]);

  const handleToggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleReusePrompt = (prompt: string) => {
    onReusePrompt(prompt);
  };

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const handleDeleteHistory = async (id: number) => {
    try {
      await deleteChatHistory.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete history:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'failed':
        return <Error color="error" />;
      case 'partial':
        return <Schedule color="warning" />;
      default:
        return <Schedule color="disabled" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'partial':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Stack alignItems="center" spacing={2} py={4}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading chat history...
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            Failed to load chat history. Please try again.
          </Alert>
          <Button 
            startIcon={<Refresh />} 
            onClick={() => refetch()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <History color="primary" />
              Prompt History
            </Typography>
            <Badge badgeContent={filteredHistory.length} color="primary">
              <IconButton 
                size="small" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterList />
              </IconButton>
            </Badge>
          </Box>

          {/* Filters */}
          <Collapse in={showFilters}>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <TextField
                size="small"
                placeholder="Search prompts and responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                fullWidth
              />
              
              <Stack direction="row" spacing={2}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="partial">Partial</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Provider</InputLabel>
                  <Select
                    value={providerFilter}
                    label="Provider"
                    onChange={(e) => setProviderFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="openai">OpenAI</MenuItem>
                    <MenuItem value="github_models">GitHub Models</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Collapse>

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <Box textAlign="center" py={4}>
              <AutoAwesome sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {searchTerm || statusFilter !== 'all' || providerFilter !== 'all' 
                  ? 'No prompts match your filters'
                  : 'No prompt history yet'
                }
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredHistory.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      p: 2,
                      mb: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    {/* Header */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ListItemIcon sx={{ minWidth: 'auto' }}>
                          {getStatusIcon(item.status)}
                        </ListItemIcon>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip 
                          label={item.provider} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={item.status} 
                          size="small" 
                          color={getStatusColor(item.status) as 'success' | 'error' | 'warning' | 'default'}
                        />
                      </Box>
                    </Box>

                    {/* Prompt */}
                    <Box mt={1} width="100%">
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        Prompt:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          backgroundColor: 'grey.50', 
                          p: 1, 
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }}
                      >
                        {item.prompt}
                      </Typography>
                    </Box>

                    {/* Response Preview */}
                    {item.response && (
                      <Box mt={1} width="100%">
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                          Response:
                        </Typography>
                        <Collapse in={expandedItems.has(item.id)}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              backgroundColor: 'grey.50', 
                              p: 1, 
                              borderRadius: 1,
                              fontFamily: 'monospace',
                              fontSize: '0.875rem'
                            }}
                          >
                            {item.response}
                          </Typography>
                        </Collapse>
                        {!expandedItems.has(item.id) && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              backgroundColor: 'grey.50', 
                              p: 1, 
                              borderRadius: 1,
                              cursor: 'pointer'
                            }}
                            onClick={() => handleToggleExpanded(item.id)}
                          >
                            {item.response.length > 100 
                              ? `${item.response.substring(0, 100)}...` 
                              : item.response
                            }
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Actions */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Reuse this prompt">
                          <IconButton 
                            size="small" 
                            onClick={() => handleReusePrompt(item.prompt)}
                            color="primary"
                          >
                            <Send />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Copy prompt">
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopyPrompt(item.prompt)}
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                        
                        {onEditPrompt && (
                          <Tooltip title="Edit prompt">
                            <IconButton 
                              size="small" 
                              onClick={() => onEditPrompt(item)}
                            >
                              <AutoAwesome />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      
                      <Box display="flex" gap={1}>
                        {item.response && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleToggleExpanded(item.id)}
                          >
                            {expandedItems.has(item.id) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        )}
                        
                        <Tooltip title="Delete this entry">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteHistory(item.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
} 