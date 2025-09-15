import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  Plane as FlightIcon,
  Building as HotelIcon,
  Calendar as EventIcon,
  Car as TransportIcon,
  UtensilsCrossed as RestaurantIcon,
  Ticket as ActivityIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
} from 'lucide-react';
import { TravelNode as TravelNodeType } from '../../types/node.types';
import { NODE_TYPES, PRIORITIES, NODE_STATUS } from '../../utils/constants';
import { createNodeAnimation, getHoverAnimation, getDragAnimation } from '../../theme/animations';

interface TravelNodeProps {
  node: TravelNodeType;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  onEdit: (node: TravelNodeType) => void;
  onDelete: (nodeId: string) => void;
  onMouseDown: (event: React.MouseEvent, nodeId: string) => void;
  onMouseEnter: (nodeId: string) => void;
  onMouseLeave: () => void;
  onClick: (nodeId: string) => void;
}

const TravelNode: React.FC<TravelNodeProps> = ({
  node,
  isSelected,
  isHovered,
  isDragging,
  onEdit,
  onDelete,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const getNodeIcon = () => {
    switch (node.type) {
      case 'flight': return <FlightIcon />;
      case 'hotel': return <HotelIcon />;
      case 'event': return <EventIcon />;
      case 'transport': return <TransportIcon />;
      case 'restaurant': return <RestaurantIcon />;
      case 'activity': return <ActivityIcon />;
      default: return <EventIcon />;
    }
  };

  const nodeColor = NODE_TYPES[node.type].color;
  const priorityColor = PRIORITIES[node.priority].color;
  const statusColor = NODE_STATUS[node.status].color;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(node.id);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : isSelected ? 100 : isHovered ? 50 : 1,
      }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
      onMouseEnter={() => onMouseEnter(node.id)}
      onMouseLeave={onMouseLeave}
      onClick={handleNodeClick}
    >
      <Paper
        elevation={isDragging ? 12 : isHovered ? 8 : 4}
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: nodeColor,
          color: 'white',
          position: 'relative',
          border: isSelected ? '3px solid #fff' : '2px solid transparent',
          animation: createNodeAnimation(node.type),
          ...getHoverAnimation(),
          ...getDragAnimation(),
          '&.dragging': {
            transform: 'translate(-50%, -50%) scale(1.05) rotate(5deg)',
          },
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          ...(isDragging && {
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
          }),
        }}
        className={isDragging ? 'dragging' : ''}
      >
        {/* Main icon */}
        <Box sx={{ fontSize: 32, mb: 1 }}>
          {getNodeIcon()}
        </Box>

        {/* Title */}
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: 1,
            maxWidth: '90px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {node.title}
        </Typography>

        {/* Status indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: statusColor,
            border: '2px solid white',
          }}
        />

        {/* Priority indicator */}
        {node.priority !== 'medium' && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              left: -4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: priorityColor,
              border: '2px solid white',
            }}
          />
        )}

        {/* Action buttons (shown on hover) */}
        {(isHovered || isSelected) && !isDragging && (
          <Box
            sx={{
              position: 'absolute',
              top: -15,
              right: -60,
              display: 'flex',
              gap: 1,
              opacity: isHovered || isSelected ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              zIndex: 1000,
            }}
          >
            <Box
              component="button"
              onClick={(e) => {
                console.log('Edit button clicked for:', node.id);
                e.preventDefault();
                e.stopPropagation();
                onEdit(node);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: 'black',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <EditIcon size={16} />
            </Box>
            <Box
              component="button"
              onClick={(e) => {
                console.log('Delete button clicked for:', node.id);
                e.preventDefault();
                e.stopPropagation();
                onDelete(node.id);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              sx={{
                backgroundColor: 'rgba(244,67,54,0.9)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#f44336',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <DeleteIcon size={16} />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TravelNode;