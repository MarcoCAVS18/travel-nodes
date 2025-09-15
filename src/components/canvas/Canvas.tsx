import React, { useRef, useState, useCallback } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { NodeType } from '../../types/node.types';
import { useNodesContext } from '../../contexts/NodesContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import CanvasBackground from './CanvasBackground';
import FloatingActionButton from './FloatingActionButton';
import TravelNode from '../nodes/TravelNode';
import NodeConnections from '../nodes/NodeConnections';
import NodeDialog from '../dialogs/NodeDialog';
import ConfirmDialog from '../common/ConfirmDialog';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const {
    nodes,
    selectedNodeIds,
    hoveredNodeId,
    addNode,
    updateNode,
    deleteNode,
    selectNode,
    clearSelection,
    setHoveredNode,
  } = useNodesContext();

  const { settings } = useThemeContext();

  // Simple dialog states
  const [nodeDialog, setNodeDialog] = useState({
    open: false,
    mode: 'create' as 'create' | 'edit' | 'view',
    nodeId: undefined as string | undefined,
    nodeType: undefined as NodeType | undefined,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    nodeId: undefined as string | undefined,
    title: '',
    message: '',
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Drag and drop
  const { startDrag, isDragging } = useDragAndDrop({
    onNodeMove: (nodeId: string, newPosition) => {
      updateNode(nodeId, { position: newPosition });
    },
    canvasRef,
    enableGridSnap: settings.gridSnap,
  });

  // Canvas click handler
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (event.target === canvasRef.current) {
      clearSelection();
    }
  }, [clearSelection]);

  // Create node handler
  const handleCreateNode = useCallback((type: NodeType) => {
    setNodeDialog({
      open: true,
      mode: 'create',
      nodeType: type,
      nodeId: undefined,
    });
  }, []);

  // Edit node handler
  const handleEditNode = useCallback((node: any) => {
    console.log('Edit node called with:', node);
    setNodeDialog({
      open: true,
      mode: 'edit',
      nodeId: node.id,
      nodeType: undefined,
    });
  }, []);

  // Delete node handler
  const handleDeleteNode = useCallback((nodeId: string) => {
    console.log('Delete node called with:', nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      console.log('Node not found for deletion:', nodeId);
      return;
    }

    setConfirmDialog({
      open: true,
      nodeId,
      title: 'Delete Node',
      message: `Are you sure you want to delete "${node.title}"?`,
    });
  }, [nodes]);

  // Node click handler
  const handleNodeClick = useCallback((nodeId: string) => {
    selectNode(nodeId);
  }, [selectNode]);

  // Dialog save handler
  const handleDialogSave = useCallback((formData: any) => {
    try {
      if (nodeDialog.mode === 'create') {
        // Calculate position for new node
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        const x = canvasRect ? canvasRect.width / 2 + (Math.random() - 0.5) * 200 : 400;
        const y = canvasRect ? canvasRect.height / 2 + (Math.random() - 0.5) * 200 : 300;
        
        addNode(formData.type, { x, y }, formData.title);
        
        setNotification({
          open: true,
          message: `${formData.title} created successfully!`,
          severity: 'success',
        });
      } else if (nodeDialog.mode === 'edit' && nodeDialog.nodeId) {
        updateNode(nodeDialog.nodeId, formData);
        
        setNotification({
          open: true,
          message: `${formData.title} updated successfully!`,
          severity: 'success',
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred',
        severity: 'error',
      });
    }
    
    setNodeDialog({ open: false, mode: 'create', nodeId: undefined, nodeType: undefined });
  }, [nodeDialog.mode, nodeDialog.nodeId, addNode, updateNode]);

  // Confirm delete handler
  const handleConfirmDelete = useCallback(() => {
    if (confirmDialog.nodeId) {
      deleteNode(confirmDialog.nodeId);
      setNotification({
        open: true,
        message: 'Node deleted successfully',
        severity: 'success',
      });
    }
    setConfirmDialog({ open: false, nodeId: undefined, title: '', message: '' });
  }, [confirmDialog.nodeId, deleteNode]);

  // Get selected node for dialog
  const selectedNode = nodeDialog.nodeId ? nodes.find(n => n.id === nodeDialog.nodeId) : undefined;

  return (
    <Box
      ref={canvasRef}
      onClick={handleCanvasClick}
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        minHeight: '600px',
      }}
    >
      {/* Background */}
      <CanvasBackground showGrid={settings.gridSnap} />

      {/* Node connections */}
      <NodeConnections
        nodes={nodes}
        connections={[]}
        showConnections={settings.showConnections}
      />

      {/* Nodes container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minWidth: '1200px',
          minHeight: '800px',
          pointerEvents: 'none',
        }}
      >
        {nodes.map((node) => (
          <Box
            key={node.id}
            sx={{
              pointerEvents: 'auto',
            }}
          >
            <TravelNode
              node={node}
              isSelected={selectedNodeIds.includes(node.id)}
              isHovered={hoveredNodeId === node.id}
              isDragging={isDragging(node.id)}
              onEdit={handleEditNode}
              onDelete={handleDeleteNode}
              onMouseDown={(event) => {
                console.log('Node mousedown:', node.id);
                startDrag(event, node.id, node.position);
              }}
              onMouseEnter={(nodeId) => {
                console.log('Node mouse enter:', nodeId);
                setHoveredNode(nodeId);
              }}
              onMouseLeave={() => {
                console.log('Node mouse leave');
                setHoveredNode(null);
              }}
              onClick={(nodeId) => {
                console.log('Node clicked:', nodeId);
                handleNodeClick(nodeId);
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Floating Action Button */}
      <FloatingActionButton
        onCreateNode={handleCreateNode}
        disabled={isDragging()}
      />

      {/* Node Dialog */}
      <NodeDialog
        open={nodeDialog.open}
        mode={nodeDialog.mode}
        node={selectedNode}
        nodeType={nodeDialog.nodeType}
        onClose={() => setNodeDialog({ open: false, mode: 'create', nodeId: undefined, nodeType: undefined })}
        onSave={handleDialogSave}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant="danger"
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ open: false, nodeId: undefined, title: '', message: '' })}
      />

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Canvas;