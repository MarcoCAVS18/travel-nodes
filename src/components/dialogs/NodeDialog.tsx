import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';
import { TravelNode, NodeType } from '../../types/node.types';
import { getDialogAnimation } from '../../theme/animations';
import NodeForm from './NodeForm';

interface NodeDialogProps {
  open: boolean;
  mode: 'create' | 'edit' | 'view';
  node?: TravelNode;
  nodeType?: NodeType;
  onClose: () => void;
  onSave: (nodeData: Partial<TravelNode>) => void;
}

const NodeDialog: React.FC<NodeDialogProps> = ({
  open,
  mode,
  node,
  nodeType,
  onClose,
  onSave,
}) => {
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return `Create New ${nodeType ? nodeType.charAt(0).toUpperCase() + nodeType.slice(1) : 'Node'}`;
      case 'edit':
        return `Edit ${node?.title || 'Node'}`;
      case 'view':
        return node?.title || 'Node Details';
      default:
        return 'Node';
    }
  };

  const handleSave = (formData: Partial<TravelNode>) => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          animation: open ? `${getDialogAnimation()} 0.3s ease-out` : 'none',
          borderRadius: 2,
          minHeight: '60vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ position: 'relative', pb: 2 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ pr: 5 }}>
          {getTitle()}
        </Typography>
        
        {mode === 'view' && node && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Created: {node.createdAt.toLocaleDateString()}
            {node.updatedAt.getTime() !== node.createdAt.getTime() && (
              <span> • Updated: {node.updatedAt.toLocaleDateString()}</span>
            )}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <NodeForm
          mode={mode}
          initialData={node}
          nodeType={nodeType}
          onSubmit={handleSave}
          onCancel={onClose}
        />
      </DialogContent>

      {mode === 'view' && (
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default NodeDialog;