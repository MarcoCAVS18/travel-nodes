export interface Position {
  x: number;
  y: number;
}

export interface NodeConnection {
  fromNodeId: string;
  toNodeId: string;
  connectionType: 'dependency' | 'sequence' | 'related';
  label?: string;
}

export interface TravelNode {
  id: string;
  title: string;
  description: string;
  type: NodeType;
  confirmed: boolean;
  position: Position;
  createdAt: Date;
  updatedAt: Date;
  date?: Date;
  details: NodeDetails;
  tags: string[];
  priority: Priority;
  status: NodeStatus;
}

export type NodeType = 'flight' | 'hotel' | 'event' | 'transport' | 'restaurant' | 'activity';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type NodeStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface NodeDetails {
  // Vuelos
  airline?: string;
  flightNumber?: string;
  departure?: {
    airport: string;
    time: Date;
    terminal?: string;
  };
  arrival?: {
    airport: string;
    time: Date;
    terminal?: string;
  };
  bookingReference?: string;
  
  // Hoteles
  hotelName?: string;
  checkIn?: Date;
  checkOut?: Date;
  roomType?: string;
  address?: string;
  
  // Eventos/Actividades
  location?: string;
  duration?: number; // en minutos
  cost?: number;
  currency?: string;
  website?: string;
  phone?: string;
  
  // Transporte
  vehicleType?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  
  // General
  notes?: string;
  attachments?: string[];
}

export interface DragState {
  isDragging: boolean;
  dragNodeId: string | null;
  offset: Position;
  startPosition: Position;
}

export interface NodeFilter {
  types: NodeType[];
  status: NodeStatus[];
  priority: Priority[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm: string;
}