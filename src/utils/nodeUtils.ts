import { TravelNode, NodeType, Position } from '../types/node.types';
import { NODE_TYPES, NODE_CONFIG, VALIDATION } from './constants';

export const createNewNode = (
  type: NodeType,
  position: Position,
  title?: string
): Omit<TravelNode, 'id'> => {
  const now = new Date();
  
  return {
    title: title || `New ${NODE_TYPES[type].label}`,
    description: '',
    type,
    confirmed: false,
    position,
    createdAt: now,
    updatedAt: now,
    details: {},
    tags: [],
    priority: 'medium',
    status: 'pending',
  };
};

export const generateNodeId = (): string => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validateNode = (node: Partial<TravelNode>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!node.title || node.title.trim().length < VALIDATION.MIN_TITLE_LENGTH) {
    errors.push(`Title must be at least ${VALIDATION.MIN_TITLE_LENGTH} characters`);
  }

  if (node.title && node.title.length > VALIDATION.MAX_TITLE_LENGTH) {
    errors.push(`Title must be less than ${VALIDATION.MAX_TITLE_LENGTH} characters`);
  }

  if (node.description && node.description.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
    errors.push(`Description must be less than ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`);
  }

  if (node.tags && node.tags.length > VALIDATION.MAX_TAGS) {
    errors.push(`Maximum ${VALIDATION.MAX_TAGS} tags allowed`);
  }

  if (node.tags) {
    const invalidTags = node.tags.filter(tag => tag.length > VALIDATION.MAX_TAG_LENGTH);
    if (invalidTags.length > 0) {
      errors.push(`Tags must be less than ${VALIDATION.MAX_TAG_LENGTH} characters`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getNodeColor = (type: NodeType): string => {
  return NODE_TYPES[type].color;
};

export const getNodeIcon = (type: NodeType): string => {
  return NODE_TYPES[type].icon;
};

export const formatNodeDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculateNodeDistance = (pos1: Position, pos2: Position): number => {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
};

export const findNearestValidPosition = (
  desiredPosition: Position,
  existingNodes: TravelNode[]
): Position => {
  let position = { ...desiredPosition };
  const minDistance = NODE_CONFIG.MIN_DISTANCE;
  
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    const conflicts = existingNodes.filter(node => 
      calculateNodeDistance(position, node.position) < minDistance
    );
    
    if (conflicts.length === 0) {
      return position;
    }
    
    // Try a new position in a spiral pattern
    const angle = (attempts * 30) * (Math.PI / 180);
    const radius = minDistance + (attempts * 10);
    
    position = {
      x: desiredPosition.x + Math.cos(angle) * radius,
      y: desiredPosition.y + Math.sin(angle) * radius,
    };
    
    attempts++;
  }
  
  return position;
};

export const sortNodesByDate = (nodes: TravelNode[]): TravelNode[] => {
  return [...nodes].sort((a, b) => {
    const dateA = a.date || a.createdAt;
    const dateB = b.date || b.createdAt;
    return dateA.getTime() - dateB.getTime();
  });
};

export const groupNodesByType = (nodes: TravelNode[]): Record<NodeType, TravelNode[]> => {
  return nodes.reduce((groups, node) => {
    if (!groups[node.type]) {
      groups[node.type] = [];
    }
    groups[node.type].push(node);
    return groups;
  }, {} as Record<NodeType, TravelNode[]>);
};

export const filterNodes = (
  nodes: TravelNode[],
  searchTerm: string,
  types?: NodeType[],
  statusFilter?: string[]
): TravelNode[] => {
  return nodes.filter(node => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type filter
    const matchesType = !types || types.length === 0 || types.includes(node.type);
    
    // Status filter
    const matchesStatus = !statusFilter || statusFilter.length === 0 || statusFilter.includes(node.status);
    
    return matchesSearch && matchesType && matchesStatus;
  });
};

export const exportNodesToJSON = (nodes: TravelNode[]): string => {
  return JSON.stringify(nodes, null, 2);
};

export const importNodesFromJSON = (jsonString: string): TravelNode[] => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid format: expected array');
    }
    
    return parsed.map(node => ({
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
      date: node.date ? new Date(node.date) : undefined,
    }));
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};