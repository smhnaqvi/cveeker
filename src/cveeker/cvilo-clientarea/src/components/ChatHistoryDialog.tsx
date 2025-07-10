import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  Box,
  Tabs,
  Tab
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
  Schedule,
  Close,
  ClearAll
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useRecentChatHistory, useDeleteChatHistory, useDeleteChatHistoryByResume } from '../lib/hooks/useChatHistory';
import type { ChatPromptHistory } from '../lib/services';

interface ChatHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  resumeId: number;
  onReusePrompt: (prompt: string) => void;
  onEditPrompt?: (history: ChatPromptHistory) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chat-history-tabpanel-${index}`}
      aria-labelledby={`chat-history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ChatHistoryDialog({ 
  open, 
  onClose, 
  resumeId, 
  onReusePrompt, 
  onEditPrompt 
}: ChatHistoryDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const { data: chatHistory, isLoading, error, refetch } = useRecentChatHistory(resumeId, 50);
  const deleteChatHistory = useDeleteChatHistory();
  const deleteAllHistory = useDeleteChatHistoryByResume();

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
    onClose();
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
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error('Failed to delete history:', err);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const promises = Array.from(selectedItems).map(id => deleteChatHistory.mutateAsync(id));
      await Promise.all(promises);
      setSelectedItems(new Set());
    } catch (err) {
      console.error('Failed to delete selected items:', err);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all chat history for this resume?')) {
      try {
        await deleteAllHistory.mutateAsync(resumeId);
        onClose();
      } catch (err) {
        console.error('Failed to delete all history:', err);
      }
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredHistory.map(item => item.id)));
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Prompt History</DialogTitle>
        <DialogContent>
          <Stack alignItems="center" spacing={2} py={4}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading chat history...
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Prompt History</DialogTitle>
        <DialogContent>
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
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <History color="primary" />
            Prompt History
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="chat history tabs">
              <Tab label={`All (${filteredHistory.length})`} />
              <Tab label={`Selected (${selectedItems.size})`} />
            </Tabs>
          </Box>

          {/* Filters */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
              size="small"
            >
              Filters
            </Button>
            
            <Stack direction="row" spacing={1}>
              {selectedItems.size > 0 && (
                <>
                  <Button
                    startIcon={<Delete />}
                    onClick={handleDeleteSelected}
                    variant="outlined"
                    color="error"
                    size="small"
                  >
                    Delete Selected ({selectedItems.size})
                  </Button>
                  <Button
                    startIcon={<ClearAll />}
                    onClick={handleDeleteAll}
                    variant="outlined"
                    color="error"
                    size="small"
                  >
                    Delete All
                  </Button>
                </>
              )}
            </Stack>
          </Stack>

          <Collapse in={showFilters}>
            <Stack spacing={2} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
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
          <TabPanel value={tabValue} index={0}>
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
                        borderColor: selectedItems.has(item.id) ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        backgroundColor: selectedItems.has(item.id) ? 'primary.50' : 'transparent',
                        '&:hover': {
                          backgroundColor: selectedItems.has(item.id) ? 'primary.100' : 'action.hover',
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSelectItem(item.id)}
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
                          color="text.secondary"
                          sx={{ 
                            backgroundColor: 'grey.900', 
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
                              color="text.secondary"
                              sx={{ 
                                backgroundColor: 'grey.900', 
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
                                backgroundColor: 'grey.900', 
                                p: 1, 
                                borderRadius: 1,
                                cursor: 'pointer'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleExpanded(item.id);
                              }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReusePrompt(item.prompt);
                              }}
                              color="primary"
                            >
                              <Send />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Copy prompt">
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPrompt(item.prompt);
                              }}
                            >
                              <ContentCopy />
                            </IconButton>
                          </Tooltip>
                          
                          {onEditPrompt && (
                            <Tooltip title="Edit prompt">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditPrompt(item);
                                }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleExpanded(item.id);
                              }}
                            >
                              {expandedItems.has(item.id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          )}
                          
                          <Tooltip title="Delete this entry">
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteHistory(item.id);
                              }}
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
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {selectedItems.size === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  No items selected. Click on items to select them for batch operations.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    {selectedItems.size} items selected
                  </Typography>
                  <Button onClick={handleSelectAll} size="small">
                    {selectedItems.size === filteredHistory.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </Box>
                
                <List>
                  {filteredHistory
                    .filter(item => selectedItems.has(item.id))
                    .map((item) => (
                      <ListItem key={item.id} sx={{ border: 1, borderColor: 'primary.main', borderRadius: 1, mb: 1 }}>
                        <ListItemText
                          primary={item.prompt.substring(0, 100) + (item.prompt.length > 100 ? '...' : '')}
                          secondary={format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}
                        />
                        <Chip label={item.status} size="small" color={getStatusColor(item.status) as 'success' | 'error' | 'warning' | 'default'} />
                      </ListItem>
                    ))}
                </List>
              </Stack>
            )}
          </TabPanel>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {selectedItems.size > 0 && (
          <Button 
            onClick={handleDeleteSelected} 
            color="error" 
            variant="contained"
            startIcon={<Delete />}
          >
            Delete Selected
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
} 