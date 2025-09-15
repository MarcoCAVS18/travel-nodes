import { useState, useCallback, useRef, useEffect } from 'react';
import { Position, DragState } from '../types/node.types';
import { clampPosition, snapToGrid } from '../utils/positionUtils';

interface UseDragAndDropProps {
  onNodeMove: (nodeId: string, position: Position) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  enableGridSnap?: boolean;
  gridSize?: number;
}

export const useDragAndDrop = ({
  onNodeMove,
  canvasRef,
  enableGridSnap = false,
  gridSize = 20,
}: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragNodeId: null,
    offset: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
  });

  const dragStartTime = useRef<number>(0);
  const hasDraggedSignificantly = useRef<boolean>(false);

  const startDrag = useCallback((
    event: React.MouseEvent,
    nodeId: string,
    nodePosition: Position
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = event.clientX;
    const clientY = event.clientY;

    const offset = {
      x: clientX - rect.left - nodePosition.x,
      y: clientY - rect.top - nodePosition.y,
    };

    setDragState({
      isDragging: true,
      dragNodeId: nodeId,
      offset,
      startPosition: { x: clientX, y: clientY },
    });

    dragStartTime.current = Date.now();
    hasDraggedSignificantly.current = false;

    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [canvasRef]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragState.isDragging || !dragState.dragNodeId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let newPosition = {
      x: event.clientX - rect.left - dragState.offset.x,
      y: event.clientY - rect.top - dragState.offset.y,
    };

    // Check if drag is significant
    const dragDistance = Math.sqrt(
      Math.pow(event.clientX - dragState.startPosition.x, 2) +
      Math.pow(event.clientY - dragState.startPosition.y, 2)
    );

    if (dragDistance > 5) {
      hasDraggedSignificantly.current = true;
    }

    // Clamp position to canvas bounds
    newPosition = clampPosition(
      newPosition,
      rect.width,
      rect.height
    );

    // Apply grid snapping if enabled
    if (enableGridSnap) {
      newPosition = snapToGrid(newPosition, gridSize);
    }

    onNodeMove(dragState.dragNodeId, newPosition);
  }, [dragState, onNodeMove, canvasRef, enableGridSnap, gridSize]);

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        dragNodeId: null,
        offset: { x: 0, y: 0 },
        startPosition: { x: 0, y: 0 },
      });

      // Reset drag tracking
      hasDraggedSignificantly.current = false;
    }

    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [dragState.isDragging, handleMouseMove]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const cancelDrag = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        dragNodeId: null,
        offset: { x: 0, y: 0 },
        startPosition: { x: 0, y: 0 },
      });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  const isDragging = (nodeId?: string): boolean => {
    if (!nodeId) return dragState.isDragging;
    return dragState.isDragging && dragState.dragNodeId === nodeId;
  };

  const wasJustClicked = (): boolean => {
    return !hasDraggedSignificantly.current;
  };

  return {
    dragState,
    startDrag,
    cancelDrag,
    isDragging,
    wasJustClicked,
  };
};