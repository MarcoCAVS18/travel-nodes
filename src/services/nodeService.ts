import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { TravelNode } from '../types/node.types';
import { FIREBASE_COLLECTIONS } from '../utils/constants';

// Convert Firestore document to TravelNode
const convertDocToNode = (doc: any): TravelNode => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    date: data.date?.toDate() || undefined,
  };
};

// Convert TravelNode to Firestore format
const convertNodeToDoc = (node: TravelNode) => {
  return {
    ...node,
    createdAt: Timestamp.fromDate(node.createdAt),
    updatedAt: Timestamp.fromDate(node.updatedAt),
    date: node.date ? Timestamp.fromDate(node.date) : null,
  };
};

export const nodeService = {
  // Get all nodes for a user
  async getUserNodes(userId: string): Promise<TravelNode[]> {
    try {
      const q = query(
        collection(db, FIREBASE_COLLECTIONS.NODES),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(convertDocToNode);
    } catch (error) {
      console.error('Error fetching nodes:', error);
      throw new Error('Failed to fetch nodes');
    }
  },

  // Create a new node
  async createNode(node: Omit<TravelNode, 'id'>, userId: string): Promise<string> {
    try {
      const nodeData = {
        ...convertNodeToDoc(node as TravelNode),
        userId,
      };
      
      const docRef = await addDoc(collection(db, FIREBASE_COLLECTIONS.NODES), nodeData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating node:', error);
      throw new Error('Failed to create node');
    }
  },

  // Update an existing node
  async updateNode(nodeId: string, updates: Partial<TravelNode>): Promise<void> {
    try {
      const nodeRef = doc(db, FIREBASE_COLLECTIONS.NODES, nodeId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
        ...(updates.date && { date: Timestamp.fromDate(updates.date) }),
      };
      
      await updateDoc(nodeRef, updateData);
    } catch (error) {
      console.error('Error updating node:', error);
      throw new Error('Failed to update node');
    }
  },

  // Delete a node
  async deleteNode(nodeId: string): Promise<void> {
    try {
      const nodeRef = doc(db, FIREBASE_COLLECTIONS.NODES, nodeId);
      await deleteDoc(nodeRef);
    } catch (error) {
      console.error('Error deleting node:', error);
      throw new Error('Failed to delete node');
    }
  },

  // Batch delete multiple nodes
  async deleteNodes(nodeIds: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      nodeIds.forEach(nodeId => {
        const nodeRef = doc(db, FIREBASE_COLLECTIONS.NODES, nodeId);
        batch.delete(nodeRef);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error batch deleting nodes:', error);
      throw new Error('Failed to delete nodes');
    }
  },

  // Batch update multiple nodes
  async batchUpdateNodes(updates: { nodeId: string; data: Partial<TravelNode> }[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ nodeId, data }) => {
        const nodeRef = doc(db, FIREBASE_COLLECTIONS.NODES, nodeId);
        const updateData = {
          ...data,
          updatedAt: Timestamp.fromDate(new Date()),
          ...(data.date && { date: Timestamp.fromDate(data.date) }),
        };
        batch.update(nodeRef, updateData);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error batch updating nodes:', error);
      throw new Error('Failed to update nodes');
    }
  },

  // Sync local nodes with Firestore
  async syncNodes(localNodes: TravelNode[], userId: string): Promise<TravelNode[]> {
    try {
      // Get remote nodes
      const remoteNodes = await this.getUserNodes(userId);
      
      // Simple sync strategy: use the most recently updated version
      const syncedNodes: TravelNode[] = [];
      const localNodeMap = new Map(localNodes.map(node => [node.id, node]));
      const remoteNodeMap = new Map(remoteNodes.map(node => [node.id, node]));
      
      // Process all unique node IDs
      const allNodeIds = Array.from(new Set([
        ...localNodes.map(n => n.id),
        ...remoteNodes.map(n => n.id)
      ]));
      
      for (const nodeId of allNodeIds) {
        const localNode = localNodeMap.get(nodeId);
        const remoteNode = remoteNodeMap.get(nodeId);
        
        if (localNode && remoteNode) {
          // Both exist, use most recent
          if (localNode.updatedAt > remoteNode.updatedAt) {
            await this.updateNode(nodeId, localNode);
            syncedNodes.push(localNode);
          } else {
            syncedNodes.push(remoteNode);
          }
        } else if (localNode && !remoteNode) {
          // Only local exists, create remote
          await this.createNode(localNode, userId);
          syncedNodes.push(localNode);
        } else if (!localNode && remoteNode) {
          // Only remote exists, add to local
          syncedNodes.push(remoteNode);
        }
      }
      
      return syncedNodes;
    } catch (error) {
      console.error('Error syncing nodes:', error);
      throw new Error('Failed to sync nodes');
    }
  },
};