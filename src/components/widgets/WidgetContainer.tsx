/**
 * WidgetContainer Component
 * 
 * Draggable and resizable widget container using react-rnd
 */

import React from 'react';
import { Rnd } from 'react-rnd';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  visible: boolean;
}

interface WidgetContainerProps {
  config: WidgetConfig;
  children: React.ReactNode;
  onUpdate: (id: string, updates: Partial<WidgetConfig>) => void;
  onClose: (id: string) => void;
}

export function WidgetContainer({ config, children, onUpdate, onClose }: WidgetContainerProps) {
  const handleDragStop = (data: any) => {
    // Ensure the widget stays within bounds
    const boundedX = Math.max(0, Math.min(data.x, window.innerWidth - config.width));
    const boundedY = Math.max(0, Math.min(data.y, window.innerHeight - config.height));
    
    onUpdate(config.id, { x: boundedX, y: boundedY });
  };

  const handleResizeStop = (ref: any, position: any) => {
    const newWidth = parseInt(ref.style.width);
    const newHeight = parseInt(ref.style.height);
    
    // Ensure the widget stays within bounds after resize
    const boundedX = Math.max(0, Math.min(position.x, window.innerWidth - newWidth));
    const boundedY = Math.max(0, Math.min(position.y, window.innerHeight - newHeight));
    
    onUpdate(config.id, {
      width: newWidth,
      height: newHeight,
      x: boundedX,
      y: boundedY,
    });
  };

  if (!config.visible) {
    return null;
  }

  return (
    <Rnd
      size={{ width: config.width, height: config.height }}
      position={{ x: config.x, y: config.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      minWidth={config.minWidth || 200}
      minHeight={config.minHeight || 150}
      bounds="window"
      dragHandleClassName="widget-header"
      className="widget-container"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full flex flex-col">
        {/* Widget Header */}
        <div className="widget-header flex items-center justify-between p-3 border-b border-gray-200 cursor-move">
          <h3 className="text-sm font-medium text-gray-900">{config.title}</h3>
          <button
            onClick={() => onClose(config.id)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close widget"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Widget Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </Rnd>
  );
}
