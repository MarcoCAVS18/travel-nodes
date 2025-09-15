import React from 'react';
import { Box, Paper, Typography, Chip, Divider } from '@mui/material';
import { TravelNode } from '../../types/node.types';
import { NODE_STATUS, PRIORITIES } from '../../utils/constants';
import { formatDateTime } from '../../utils/dateUtils';
import { getTooltipAnimation } from '../../theme/animations';

interface NodeTooltipProps {
  node: TravelNode;
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({ node }) => {
  const renderDetails = () => {
    const details = [];

    // Flight details
    if (node.type === 'flight' && node.details) {
      if (node.details.airline) {
        details.push({ label: 'Airline', value: node.details.airline });
      }
      if (node.details.flightNumber) {
        details.push({ label: 'Flight', value: node.details.flightNumber });
      }
      if (node.details.departure) {
        details.push({ 
          label: 'Departure', 
          value: `${node.details.departure.airport} at ${formatDateTime(new Date(node.details.departure.time))}` 
        });
      }
    }

    // Hotel details
    if (node.type === 'hotel' && node.details) {
      if (node.details.hotelName) {
        details.push({ label: 'Hotel', value: node.details.hotelName });
      }
      if (node.details.checkIn) {
        details.push({ label: 'Check-in', value: formatDateTime(new Date(node.details.checkIn)) });
      }
      if (node.details.roomType) {
        details.push({ label: 'Room', value: node.details.roomType });
      }
    }

    // General details
    if (node.details.location) {
      details.push({ label: 'Location', value: node.details.location });
    }
    if (node.details.cost) {
      details.push({ 
        label: 'Cost', 
        value: `${node.details.currency || '$'}${node.details.cost}` 
      });
    }

    return details;
  };

  const details = renderDetails();

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: 2,
        minWidth: 220,
        maxWidth: 300,
        backgroundColor: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
        pointerEvents: 'none',
        ...getTooltipAnimation(),
      }}
      elevation={8}
    >
      {/* Header */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
          {node.title}
        </Typography>
        
        {node.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {node.description}
          </Typography>
        )}

        {/* Status and Priority chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={NODE_STATUS[node.status].label}
            size="small"
            sx={{
              backgroundColor: NODE_STATUS[node.status].color,
              color: 'white',
              fontSize: '0.7rem',
            }}
          />
          {node.priority !== 'medium' && (
            <Chip
              label={PRIORITIES[node.priority].label}
              size="small"
              sx={{
                backgroundColor: PRIORITIES[node.priority].color,
                color: 'white',
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Details */}
      {details.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box>
            {details.map((detail, index) => (
              <Box key={index} sx={{ mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {detail.label}:
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {detail.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Date */}
      {node.date && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Date: {formatDateTime(node.date)}
          </Typography>
        </>
      )}

      {/* Tags */}
      {node.tags.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {node.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.65rem', height: '20px' }}
              />
            ))}
          </Box>
        </>
      )}

      {/* Notes */}
      {node.details.notes && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Notes:
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
            {node.details.notes}
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default NodeTooltip;