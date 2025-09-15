import { keyframes } from '@mui/material/styles';

export const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(100, 181, 246, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(100, 181, 246, 0);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(100, 181, 246, 0);
    transform: scale(1);
  }
`;

export const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const scaleInAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const slideUpAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const wiggleAnimation = keyframes`
  0%, 7% {
    transform: rotateZ(0);
  }
  15% {
    transform: rotateZ(-15deg);
  }
  20% {
    transform: rotateZ(10deg);
  }
  25% {
    transform: rotateZ(-10deg);
  }
  30% {
    transform: rotateZ(6deg);
  }
  35% {
    transform: rotateZ(-4deg);
  }
  40%, 100% {
    transform: rotateZ(0);
  }
`;

export const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(100, 181, 246, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(100, 181, 246, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(100, 181, 246, 0.2);
  }
`;

export const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const connectionPulseAnimation = keyframes`
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 20;
  }
`;

// Animation utility functions
export const createNodeAnimation = (nodeType: string) => {
  const baseAnimation = `${pulseAnimation} 2s infinite`;
  
  switch (nodeType) {
    case 'flight':
      return `${baseAnimation}, ${floatAnimation} 3s ease-in-out infinite`;
    case 'hotel':
      return `${baseAnimation}, ${glowAnimation} 4s ease-in-out infinite`;
    case 'event':
      return `${baseAnimation}, ${wiggleAnimation} 5s ease-in-out infinite`;
    default:
      return baseAnimation;
  }
};

export const getHoverAnimation = () => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    filter: 'brightness(1.1)',
  },
});

export const getDragAnimation = () => ({
  transition: 'transform 0.1s ease-out',
  '&.dragging': {
    transform: 'scale(1.05) rotate(5deg)',
    zIndex: 1000,
    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
  },
});

export const getConnectionAnimation = () => ({
  strokeDasharray: '10 5',
  animation: `${connectionPulseAnimation} 2s linear infinite`,
});

export const getTooltipAnimation = () => ({
  animation: `${fadeInAnimation} 0.2s ease-out`,
  transformOrigin: 'bottom center',
});

export const getDialogAnimation = () => ({
  animation: `${scaleInAnimation} 0.3s ease-out`,
  transformOrigin: 'center center',
});

export const getFabAnimation = () => ({
  animation: `${bounceAnimation} 2s infinite`,
  '&:hover': {
    animation: 'none',
    transform: 'scale(1.1)',
  },
});