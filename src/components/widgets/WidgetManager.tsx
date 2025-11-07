/**
 * WidgetManager Component
 * 
 * Manages widget state and provides widget registry
 */

import { useState, useEffect } from 'react';
import { WidgetContainer, type WidgetConfig } from './WidgetContainer';
import { DroneTelemetryWidget } from './DroneTelemetryWidget';
import { FleetStatusWidget } from './FleetStatusWidget';
import { useFleet } from '../../contexts/FleetContext.tsx';

interface WidgetManagerProps {
  className?: string;
}

// Default widget configurations
const getDefaultWidgets = (): WidgetConfig[] => [
  {
    id: 'telemetry-1',
    type: 'telemetry',
    title: 'Drone Telemetry',
    x: window.innerWidth - 250,
    y: Math.max(window.innerHeight - 300, 0), // Position near right edge, accounting for bulletin panel
    width: 250,
    height: 300,
    minWidth: 200,
    minHeight: 200,
    visible: true
  },
  {
    id: 'fleet-status-1',
    type: 'fleet-status',
    title: 'Fleet Status',
    x: 200,
    y: 0, // Position near right edge, accounting for bulletin panel
    width: 250,
    height: 300,
    minWidth: 200,
    minHeight: 200,
    visible: true
  }
];

export function WidgetManager({ className = '' }: WidgetManagerProps) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(getDefaultWidgets());
  const { state } = useFleet();

  // Load widget configurations from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('drone-widgets');
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets);
        // Ensure widgets are within current window bounds
        const boundedWidgets = parsed.map((widget: WidgetConfig) => ({
          ...widget,
          x: Math.max(0, Math.min(widget.x, window.innerWidth - widget.width)),
          y: Math.max(0, Math.min(widget.y, window.innerHeight - widget.height)),
        }));
        setWidgets(boundedWidgets);
      } catch (error) {
        // Failed to load widget configurations, using defaults
        setWidgets(getDefaultWidgets());
      }
    }
  }, []);

  // Save widget configurations to localStorage
  useEffect(() => {
    localStorage.setItem('drone-widgets', JSON.stringify(widgets));
  }, [widgets]);

  // Handle window resize to keep widgets within bounds
  useEffect(() => {
    const handleResize = () => {
      setWidgets(prev => prev.map(widget => ({
        ...widget,
        x: Math.max(0, Math.min(widget.x, window.innerWidth - widget.width)),
        y: Math.max(0, Math.min(widget.y, window.innerHeight - widget.height)),
      })));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    setWidgets(prev => prev.map(widget => {
      if (widget.id === id) {
        // react-rnd already handles bounds for drag operations, so trust the position
        return { ...widget, ...updates };
      }
      return widget;
    }));
  };

  const closeWidget = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, visible: false } : widget
    ));
  };

  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'telemetry':
        return (
          <DroneTelemetryWidget 
            drone={state.drones.find(d => d.status === 'in-mission') || state.drones[0]} 
          />
        );
      case 'fleet-status':
        return <FleetStatusWidget />;
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Unknown widget type: {widget.type}
          </div>
        );
    }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {widgets.map(widget => (
        <div key={widget.id} className="pointer-events-auto">
          <WidgetContainer
            config={widget}
            onUpdate={updateWidget}
            onClose={closeWidget}
          >
            {renderWidget(widget)}
          </WidgetContainer>
        </div>
      ))}
    </div>
  );
}
