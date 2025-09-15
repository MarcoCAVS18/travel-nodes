import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { X as CloseIcon } from 'lucide-react';
import { TravelNode } from '../../types/node.types';

interface NodeDetailViewProps {
  node: TravelNode;
  onClose: () => void;
  onExpand: () => void;
}

const NodeDetailView: React.FC<NodeDetailViewProps> = ({ node, onClose, onExpand }) => {
  return (
    <Paper
      elevation={12}
      sx={{
        position: 'absolute',
        top: node.position.y + 80,
        left: node.position.x - 150,
        width: 320,
        maxHeight: 400,
        backgroundColor: 'background.paper',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 2,
        zIndex: 1500,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {node.title}
        </Typography>
        <IconButton 
          size="small" 
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon size={20} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {/* Description */}
        {node.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {node.description}
          </Typography>
        )}

        {/* Basic Info */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Type:</strong> {node.type}
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Status:</strong> {node.status}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Priority:</strong> {node.priority}
        </Typography>

        {/* Expand button */}
        <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <button
            onClick={onExpand}
            style={{
              width: '100%',
              padding: '8px 16px',
              backgroundColor: '#64b5f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            Expand & Show Related Nodes
          </button>
        </Box>
      </Box>
    </Paper>
  );
};

export default NodeDetailView;