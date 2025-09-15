import React, { createContext, useContext, ReactNode } from 'react';
import { useNodes } from '../hooks/useNodes';
import { TravelNode, NodeType, Position } from '../types/node.types';

interface NodesContextType {
  nodes: TravelNode[];
  selectedNodeIds: string[];
  hoveredNodeId: string | null;
  isLoading: boolean;
  addNode: (type: NodeType, position: Position, title?: string) => Promise<TravelNode>;
  updateNode: (nodeId: string, updates: Partial<TravelNode>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;
  moveNode: (nodeId: string, newPosition: Position) => void;
  duplicateNode: (nodeId: string) => TravelNode | null;
  getNode: (nodeId: string) => TravelNode | undefined;
  getNodesByType: (type: NodeType) => TravelNode[];
  selectNode: (nodeId: string) => void;
  selectMultipleNodes: (nodeIds: string[]) => void;
  toggleNodeSelection: (nodeId: string) => void;
  clearSelection: () => void;
  setHoveredNode: (nodeId: string | null) => void;
  clearAllNodes: () => void;
  importNodes: (nodes: TravelNode[]) => void;
}

const NodesContext = createContext<NodesContextType | undefined>(undefined);

export const useNodesContext = (): NodesContextType => {
  const context = useContext(NodesContext);
  if (!context) {
    throw new Error('useNodesContext must be used within a NodesProvider');
  }
  return context;
};

interface NodesProviderProps {
  children: ReactNode;
}

export const NodesProvider: React.FC<NodesProviderProps> = ({ children }) => {
  const nodesHook = useNodes();

  return (
    <NodesContext.Provider value={nodesHook}>
      {children}
    </NodesContext.Provider>
  );
};