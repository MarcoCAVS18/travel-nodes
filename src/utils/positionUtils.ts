import { Position } from '../types/node.types';
import { CANVAS_CONFIG } from './constants';

export const clampPosition = (
  position: Position,
  canvasWidth: number,
  canvasHeight: number,
  nodeSize: number = 80
): Position => {
  const margin = nodeSize / 2;
  
  return {
    x: Math.max(margin, Math.min(canvasWidth - margin, position.x)),
    y: Math.max(margin, Math.min(canvasHeight - margin, position.y)),
  };
};

export const snapToGrid = (position: Position, gridSize: number = CANVAS_CONFIG.GRID_SIZE): Position => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
};

export const getRandomPosition = (
  canvasWidth: number,
  canvasHeight: number,
  margin: number = 100
): Position => {
  return {
    x: margin + Math.random() * (canvasWidth - 2 * margin),
    y: margin + Math.random() * (canvasHeight - 2 * margin),
  };
};

export const calculateDistance = (pos1: Position, pos2: Position): number => {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
};

export const calculateAngle = (from: Position, to: Position): number => {
  return Math.atan2(to.y - from.y, to.x - from.x);
};

export const moveTowards = (
  from: Position,
  to: Position,
  distance: number
): Position => {
  const angle = calculateAngle(from, to);
  return {
    x: from.x + Math.cos(angle) * distance,
    y: from.y + Math.sin(angle) * distance,
  };
};

export const isPointInCircle = (
  point: Position,
  center: Position,
  radius: number
): boolean => {
  return calculateDistance(point, center) <= radius;
};

export const getCircleIntersection = (
  center1: Position,
  radius1: number,
  center2: Position,
  radius2: number
): Position[] => {
  const d = calculateDistance(center1, center2);
  
  if (d > radius1 + radius2 || d < Math.abs(radius1 - radius2) || d === 0) {
    return [];
  }
  
  const a = (radius1 * radius1 - radius2 * radius2 + d * d) / (2 * d);
  const h = Math.sqrt(radius1 * radius1 - a * a);
  
  const p = {
    x: center1.x + a * (center2.x - center1.x) / d,
    y: center1.y + a * (center2.y - center1.y) / d,
  };
  
  return [
    {
      x: p.x + h * (center2.y - center1.y) / d,
      y: p.y - h * (center2.x - center1.x) / d,
    },
    {
      x: p.x - h * (center2.y - center1.y) / d,
      y: p.y + h * (center2.x - center1.x) / d,
    },
  ];
};

export const getViewportBounds = (
  canvasWidth: number,
  canvasHeight: number,
  zoom: number,
  pan: Position
): { min: Position; max: Position } => {
  const viewWidth = canvasWidth / zoom;
  const viewHeight = canvasHeight / zoom;
  
  return {
    min: {
      x: -pan.x,
      y: -pan.y,
    },
    max: {
      x: -pan.x + viewWidth,
      y: -pan.y + viewHeight,
    },
  };
};

export const isPositionInViewport = (
  position: Position,
  viewport: { min: Position; max: Position }
): boolean => {
  return (
    position.x >= viewport.min.x &&
    position.x <= viewport.max.x &&
    position.y >= viewport.min.y &&
    position.y <= viewport.max.y
  );
};

export const centerPositionInCanvas = (
  canvasWidth: number,
  canvasHeight: number
): Position => {
  return {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
  };
};

export const distributePositionsInCircle = (
  center: Position,
  radius: number,
  count: number
): Position[] => {
  const positions: Position[] = [];
  const angleStep = (2 * Math.PI) / count;
  
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep;
    positions.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    });
  }
  
  return positions;
};

export const distributePositionsInGrid = (
  startPosition: Position,
  columns: number,
  spacing: number,
  count: number
): Position[] => {
  const positions: Position[] = [];
  
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / columns);
    const col = i % columns;
    
    positions.push({
      x: startPosition.x + col * spacing,
      y: startPosition.y + row * spacing,
    });
  }
  
  return positions;
};