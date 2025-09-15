import React, { useState } from 'react';
import {
  Plus,
  Plane,
  Building,
  Calendar,
  Car,
  UtensilsCrossed,
  Ticket,
  X,
} from 'lucide-react';
import { NodeType } from '../../types/node.types';
import { NODE_TYPES } from '../../utils/constants';

interface FloatingActionButtonProps {
  onCreateNode: (type: NodeType) => void;
  disabled?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onCreateNode,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const nodeTypeIcons = {
    flight: Plane,
    hotel: Building,
    event: Calendar,
    transport: Car,
    restaurant: UtensilsCrossed,
    activity: Ticket,
  };

  const handleNodeTypeClick = (type: NodeType) => {
    onCreateNode(type);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'transparent',
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 1000,
        }}
      >
        {/* Action buttons */}
        {Object.entries(NODE_TYPES).map(([nodeType, config], index) => {
          const IconComponent = nodeTypeIcons[nodeType as NodeType];
          return (
            <button
              key={nodeType}
              onClick={() => handleNodeTypeClick(nodeType as NodeType)}
              title={config.label}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: config.color,
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isOpen
                  ? `translateY(-${(index + 1) * 60}px) scale(1)`
                  : 'translateY(0) scale(0)',
                opacity: isOpen ? 1 : 0,
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
              onMouseEnter={(e) => {
                if (isOpen) {
                  e.currentTarget.style.transform = `translateY(-${(index + 1) * 60}px) scale(1.1)`;
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (isOpen) {
                  e.currentTarget.style.transform = `translateY(-${(index + 1) * 60}px) scale(1)`;
                  e.currentTarget.style.filter = 'brightness(1)';
                }
              }}
            >
              <IconComponent size={20} />
            </button>
          );
        })}

        {/* Main FAB */}
        <button
          onClick={toggleOpen}
          disabled={disabled}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#64b5f6',
            color: 'white',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(100, 181, 246, 0.4)',
            transition: 'all 0.3s ease',
            opacity: disabled ? 0.6 : 1,
            transform: isOpen ? 'rotate(45deg) scale(1.1)' : 'rotate(0deg) scale(1)',
            animation: disabled ? 'none' : 'fabBounce 2s infinite',
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isOpen) {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(100, 181, 246, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !isOpen) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(100, 181, 246, 0.4)';
            }
          }}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fabBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </>
  );
};

export default FloatingActionButton;