/**
 * WidgetContainer Component
 * 
 * Draggable and resizable widget container using react-rnd
 */

import React, { useState, useCallback, useEffect } from 'react';
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
  const [isResizing, setIsResizing] = useState(false);

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    // react-rnd already handles bounds with bounds="window", so use the position directly
    onUpdate(config.id, { x: data.x, y: data.y });
  };

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleResize = useCallback((_e: any) => {
    // This is called during resize, but we don't update state here
    // to prevent the resize from continuing after mouse release
  }, []);

  const handleResizeStop = useCallback((_e: MouseEvent | TouchEvent, _direction: string, ref: HTMLElement, _delta: { width: number; height: number }, position: { x: number; y: number }) => {
    setIsResizing(false);
    
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
  }, [config.id, onUpdate]);

  // Ensure resize stops when mouse is released anywhere
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const handleTouchEnd = () => {
      setIsResizing(false);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isResizing]);

  if (!config.visible) {
    return null;
  }

  return (
    <Rnd
      size={{ width: config.width, height: config.height }}
      position={{ x: config.x, y: config.y }}
      onDragStop={handleDragStop}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
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
