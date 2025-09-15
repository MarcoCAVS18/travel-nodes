import { NodeType, Priority, NodeStatus } from '../types/node.types';

// Node configuration
export const NODE_CONFIG = {
  DEFAULT_SIZE: 120, // Increased from 80 to 120
  HOVER_SCALE: 1.1,
  DRAG_SCALE: 1.05,
  MIN_DISTANCE: 150, // Increased to accommodate larger nodes
  ANIMATION_DURATION: 200,
} as const;

// Canvas configuration
export const CANVAS_CONFIG = {
  GRID_SIZE: 20,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 2,
  DEFAULT_ZOOM: 1,
  PAN_SENSITIVITY: 1,
  ZOOM_SENSITIVITY: 0.1,
} as const;

// Node types configuration
export const NODE_TYPES: Record<NodeType, { 
  label: string; 
  color: string; 
  icon: string;
  defaultDetails: string[];
}> = {
  flight: {
    label: 'Flight',
    color: '#64b5f6',
    icon: 'flight',
    defaultDetails: ['airline', 'flightNumber', 'departure', 'arrival', 'bookingReference']
  },
  hotel: {
    label: 'Hotel',
    color: '#81c784',
    icon: 'hotel',
    defaultDetails: ['hotelName', 'checkIn', 'checkOut', 'roomType', 'address']
  },
  event: {
    label: 'Event',
    color: '#ffb74d',
    icon: 'event',
    defaultDetails: ['location', 'duration', 'cost', 'website']
  },
  transport: {
    label: 'Transport',
    color: '#ba68c8',
    icon: 'directions_car',
    defaultDetails: ['vehicleType', 'pickupLocation', 'dropoffLocation']
  },
  restaurant: {
    label: 'Restaurant',
    color: '#ff8a65',
    icon: 'restaurant',
    defaultDetails: ['location', 'cost', 'phone', 'website']
  },
  activity: {
    label: 'Activity',
    color: '#4db6ac',
    icon: 'local_activity',
    defaultDetails: ['location', 'duration', 'cost', 'notes']
  }
};

// Priority configuration
export const PRIORITIES: Record<Priority, { 
  label: string; 
  color: string; 
  weight: number;
}> = {
  low: {
    label: 'Low',
    color: '#9e9e9e',
    weight: 1
  },
  medium: {
    label: 'Medium',
    color: '#ff9800',
    weight: 2
  },
  high: {
    label: 'High',
    color: '#f44336',
    weight: 3
  },
  critical: {
    label: 'Critical',
    color: '#d32f2f',
    weight: 4
  }
} as const;

// Status configuration
export const NODE_STATUS: Record<NodeStatus, { 
  label: string; 
  color: string;
  icon: string;
}> = {
  pending: {
    label: 'Pending',
    color: '#ff9800',
    icon: 'schedule'
  },
  confirmed: {
    label: 'Confirmed',
    color: '#4caf50',
    icon: 'check_circle'
  },
  cancelled: {
    label: 'Cancelled',
    color: '#f44336',
    icon: 'cancel'
  },
  completed: {
    label: 'Completed',
    color: '#2196f3',
    icon: 'done_all'
  }
} as const;

// Animation keyframes
export const ANIMATIONS = {
  PULSE: 'pulse 2s infinite',
  BOUNCE: 'bounce 0.5s ease-in-out',
  FADE_IN: 'fadeIn 0.3s ease-in',
  SCALE_IN: 'scaleIn 0.2s ease-out',
  SLIDE_UP: 'slideUp 0.3s ease-out'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  NODES: 'travel_nodes_data',
  SETTINGS: 'travel_nodes_settings',
  CANVAS_STATE: 'travel_nodes_canvas',
  USER_PREFERENCES: 'travel_nodes_preferences'
} as const;

// Firebase collections
export const FIREBASE_COLLECTIONS = {
  NODES: 'nodes',
  USERS: 'users',
  CONNECTIONS: 'connections'
} as const;

// Validation rules
export const VALIDATION = {
  MIN_TITLE_LENGTH: 2,
  MAX_TITLE_LENGTH: 50,
  MIN_DESCRIPTION_LENGTH: 0,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS: 10,
  MAX_TAG_LENGTH: 20
} as const;

// Default values
export const DEFAULTS = {
  NODE_POSITION: { x: 400, y: 300 },
  CANVAS_ZOOM: 1,
  CANVAS_PAN: { x: 0, y: 0 },
  NOTIFICATION_DURATION: 4000,
  AUTO_SAVE_DELAY: 2000
} as const;

// Currency codes
export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CHF', 'CNY', 'ARS'
] as const;

// Airport codes (sample - expand as needed)
export const COMMON_AIRPORTS = {
  'SYD': 'Sydney (Kingsford Smith)',
  'MEL': 'Melbourne (Tullamarine)',
  'BNE': 'Brisbane',
  'PER': 'Perth',
  'ADL': 'Adelaide',
  'LAX': 'Los Angeles',
  'JFK': 'New York (JFK)',
  'LHR': 'London (Heathrow)',
  'CDG': 'Paris (Charles de Gaulle)',
  'NRT': 'Tokyo (Narita)',
  'EZE': 'Buenos Aires (Ezeiza)'
} as const;