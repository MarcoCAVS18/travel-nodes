import { useState, useCallback, useEffect } from 'react';
import { TravelNode, NodeType, Position } from '../types/node.types';
import { createNewNode, generateNodeId, validateNode, findNearestValidPosition } from '../utils/nodeUtils';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { nodeService } from '../services/nodeService';

// Simple user ID for public app
const PUBLIC_USER_ID = 'public-user';

export const useNodes = () => {
  const [storedNodes, setStoredNodes] = useLocalStorage<TravelNode[]>(STORAGE_KEYS.NODES, []);
  const [nodes, setNodes] = useState<TravelNode[]>(storedNodes);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load nodes from Firebase on first mount
  useEffect(() => {
    const loadNodes = async () => {
      if (nodes.length === 0) {
        setIsLoading(true);
        try {
          const firebaseNodes = await nodeService.getUserNodes(PUBLIC_USER_ID);
          if (firebaseNodes.length > 0) {
            setNodes(firebaseNodes);
            setStoredNodes(firebaseNodes);
          }
        } catch (error) {
          console.log('No existing nodes in Firebase, starting fresh');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadNodes();
  }, []);

  // Save to both localStorage and Firebase
  const saveToStorage = useCallback(async (newNodes: TravelNode[]) => {
    setStoredNodes(newNodes);
    
    // Also save to Firebase (fire and forget)
    try {
      // For simplicity, we'll batch save all nodes
      if (newNodes.length > 0) {
        // Clear old nodes first, then save new ones
        const existingNodes = await nodeService.getUserNodes(PUBLIC_USER_ID);
        if (existingNodes.length > 0) {
          await nodeService.deleteNodes(existingNodes.map(n => n.id));
        }
        
        // Save new nodes
        for (const node of newNodes) {
          await nodeService.createNode(node, PUBLIC_USER_ID);
        }
      }
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }, [setStoredNodes]);

  // Save whenever nodes change
  useEffect(() => {
    if (nodes.length >= 0) { // Allow empty arrays
      saveToStorage(nodes);
    }
  }, [nodes, saveToStorage]);

  const addNode = useCallback(async (type: NodeType, position: Position, title?: string) => {
    const newNodeData = createNewNode(type, position, title);
    const validatedPosition = findNearestValidPosition(position, nodes);
    
    const newNode: TravelNode = {
      ...newNodeData,
      id: generateNodeId(),
      position: validatedPosition,
    };

    const validation = validateNode(newNode);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    setNodes(prev => [...prev, newNode]);
    return newNode;
  }, [nodes]);

  const updateNode = useCallback((nodeId: string, updates: Partial<TravelNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, ...updates, updatedAt: new Date() }
        : node
    ));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setSelectedNodeIds(prev => prev.filter(id => id !== nodeId));
  }, []);

  const deleteNodes = useCallback((nodeIds: string[]) => {
    setNodes(prev => prev.filter(node => !nodeIds.includes(node.id)));
    setSelectedNodeIds([]);
  }, []);

  const moveNode = useCallback((nodeId: string, newPosition: Position) => {
    updateNode(nodeId, { position: newPosition });
  }, [updateNode]);

  const duplicateNode = useCallback((nodeId: string) => {
    const originalNode = nodes.find(node => node.id === nodeId);
    if (!originalNode) return null;

    const duplicatedNode: TravelNode = {
      ...originalNode,
      id: generateNodeId(),
      title: `${originalNode.title} (Copy)`,
      position: {
        x: originalNode.position.x + 100,
        y: originalNode.position.y + 50,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNodes(prev => [...prev, duplicatedNode]);
    return duplicatedNode;
  }, [nodes]);

  const getNode = useCallback((nodeId: string) => {
    return nodes.find(node => node.id === nodeId);
  }, [nodes]);

  const getNodesByType = useCallback((type: NodeType) => {
    return nodes.filter(node => node.type === type);
  }, [nodes]);

  const selectNode = useCallback((nodeId: string) => {
    setSelectedNodeIds([nodeId]);
  }, []);

  const selectMultipleNodes = useCallback((nodeIds: string[]) => {
    setSelectedNodeIds(nodeIds);
  }, []);

  const toggleNodeSelection = useCallback((nodeId: string) => {
    setSelectedNodeIds(prev => 
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeIds([]);
  }, []);

  const setHoveredNode = useCallback((nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  }, []);

  const clearAllNodes = useCallback(() => {
    setNodes([]);
    setSelectedNodeIds([]);
    setHoveredNodeId(null);
  }, []);

  const importNodes = useCallback((newNodes: TravelNode[]) => {
    setNodes(newNodes);
    setSelectedNodeIds([]);
    setHoveredNodeId(null);
  }, []);

  return {
    nodes,
    selectedNodeIds,
    hoveredNodeId,
    isLoading,
    addNode,
    updateNode,
    deleteNode,
    deleteNodes,
    moveNode,
    duplicateNode,
    getNode,
    getNodesByType,
    selectNode,
    selectMultipleNodes,
    toggleNodeSelection,
    clearSelection,
    setHoveredNode,
    clearAllNodes,
    importNodes,
  };
};