import React from 'react';
import { Box } from '@mui/material';
import { TravelNode, NodeConnection } from '../../types/node.types';
import { getConnectionAnimation } from '../../theme/animations';

interface NodeConnectionsProps {
  nodes: TravelNode[];
  connections: NodeConnection[];
  showConnections: boolean;
}

const NodeConnections: React.FC<NodeConnectionsProps> = ({
  nodes,
  connections,
  showConnections,
}) => {
  if (!showConnections || connections.length === 0) {
    return null;
  }

  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  const getConnectionColor = (type: NodeConnection['connectionType']) => {
    switch (type) {
      case 'dependency':
        return '#f44336'; // Red for dependencies
      case 'sequence':
        return '#2196f3'; // Blue for sequences
      case 'related':
        return '#4caf50'; // Green for related
      default:
        return '#9e9e9e';
    }
  };

  const renderConnection = (connection: NodeConnection) => {
    const fromNode = nodeMap.get(connection.fromNodeId);
    const toNode = nodeMap.get(connection.toNodeId);

    if (!fromNode || !toNode) {
      return null;
    }

    const startX = fromNode.position.x;
    const startY = fromNode.position.y;
    const endX = toNode.position.x;
    const endY = toNode.position.y;

    // Calculate control points for curved line
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const curvature = Math.min(distance * 0.2, 50);

    const color = getConnectionColor(connection.connectionType);

    return (
      <g key={`${connection.fromNodeId}-${connection.toNodeId}`}>
        {/* Main connection line */}
        <path
          d={`M ${startX} ${startY} Q ${midX} ${midY - curvature} ${endX} ${endY}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity={0.7}
          style={getConnectionAnimation()}
        />
        
        {/* Arrowhead */}
        <polygon
          points={`${endX},${endY} ${endX - 8},${endY - 4} ${endX - 8},${endY + 4}`}
          fill={color}
          opacity={0.8}
          transform={`rotate(${Math.atan2(endY - midY, endX - midX) * 180 / Math.PI} ${endX} ${endY})`}
        />

        {/* Connection label */}
        {connection.label && (
          <text
            x={midX}
            y={midY - curvature - 10}
            textAnchor="middle"
            fill={color}
            fontSize="10"
            opacity={0.8}
          >
            {connection.label}
          </text>
        )}
      </g>
    );
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {connections.map(renderConnection)}
      </svg>
    </Box>
  );
};

export default NodeConnections;