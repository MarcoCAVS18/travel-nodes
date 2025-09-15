import React from 'react';
import { Box } from '@mui/material';
import { CANVAS_CONFIG } from '../../utils/constants';

interface CanvasBackgroundProps {
  showGrid?: boolean;
  gridSize?: number;
}

const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  showGrid = true,
  gridSize = CANVAS_CONFIG.GRID_SIZE,
}) => {
  const gridPattern = showGrid ? {
    backgroundImage: `
      radial-gradient(circle at ${gridSize}px ${gridSize}px, rgba(255,255,255,0.15) 1px, transparent 0),
      radial-gradient(circle at 0 0, rgba(255,255,255,0.15) 1px, transparent 0)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`,
    backgroundPosition: '0 0, 0 0',
  } : {};

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'background.default',
        ...gridPattern,
        // Subtle animated background elements
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(100, 181, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(129, 199, 132, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 183, 77, 0.03) 0%, transparent 50%)
          `,
          animation: 'backgroundFloat 20s ease-in-out infinite',
          '@keyframes backgroundFloat': {
            '0%, 100%': {
              transform: 'translateY(0) rotate(0deg)',
            },
            '33%': {
              transform: 'translateY(-10px) rotate(1deg)',
            },
            '66%': {
              transform: 'translateY(5px) rotate(-1deg)',
            },
          },
        },
        // Noise texture for depth
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
        },
        pointerEvents: 'none',
      }}
    />
  );
};

export default CanvasBackground;