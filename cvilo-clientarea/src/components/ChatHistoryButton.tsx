import { useState } from 'react';
import { Button, Badge, Tooltip } from '@mui/material';
import { History } from '@mui/icons-material';
import ChatHistoryDialog from './ChatHistoryDialog';
import { useRecentChatHistory } from '../lib/hooks/useChatHistory';
import type { ChatPromptHistory } from '../lib/services';

interface ChatHistoryButtonProps {
  resumeId: number;
  onReusePrompt: (prompt: string) => void;
  onEditPrompt?: (history: ChatPromptHistory) => void;
  variant?: 'button' | 'icon';
  size?: 'small' | 'medium' | 'large';
}

export default function ChatHistoryButton({ 
  resumeId, 
  onReusePrompt, 
  onEditPrompt,
  variant = 'button',
  size = 'medium'
}: ChatHistoryButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: chatHistory } = useRecentChatHistory(resumeId, 5);

  const historyCount = chatHistory?.data?.history?.length || 0;

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title={`View prompt history (${historyCount} items)`}>
          <Badge badgeContent={historyCount} color="primary">
            <Button
              variant="outlined"
              size={size}
              startIcon={<History />}
              onClick={handleOpenDialog}
              disabled={historyCount === 0}
            >
              History
            </Button>
          </Badge>
        </Tooltip>

        <ChatHistoryDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          resumeId={resumeId}
          onReusePrompt={onReusePrompt}
          onEditPrompt={onEditPrompt}
        />
      </>
    );
  }

  return (
    <>
      <Tooltip title={`View prompt history (${historyCount} items)`}>
        <Button
          variant="outlined"
          size={size}
          startIcon={<History />}
          onClick={handleOpenDialog}
          disabled={historyCount === 0}
        >
          Prompt History ({historyCount})
        </Button>
      </Tooltip>

      <ChatHistoryDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        resumeId={resumeId}
        onReusePrompt={onReusePrompt}
        onEditPrompt={onEditPrompt}
      />
    </>
  );
} 