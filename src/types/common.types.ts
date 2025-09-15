export interface DialogState {
  open: boolean;
  mode: 'create' | 'edit' | 'view';
  nodeId?: string;
}

export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface CanvasState {
  zoom: number;
  pan: Position;
  selectedNodeIds: string[];
  hoveredNodeId: string | null;
}

export interface Position {
  x: number;
  y: number;
}

export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
}

export interface AppSettings {
  autoSave: boolean;
  showConnections: boolean;
  enableAnimations: boolean;
  gridSnap: boolean;
  theme: Theme;
}

// Firebase related types
export interface FirebaseError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}