/**
 * BulletinPanel Component
 * 
 * Displays system status, alerts, and drone health information
 */

import { useState } from 'react';
import { useFleet } from '../../contexts/FleetContext.tsx';
//import { Button } from '../ui';

interface BulletinPanelProps {
  className?: string;
}

interface BulletinItem {
  id: string;
  type: 'status' | 'alert' | 'health';
  title: string;
  message: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high';
}

export function BulletinPanel({ className = '' }: BulletinPanelProps) {
  const { getFleetStats } = useFleet();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const fleetStats = getFleetStats();

  // Mock bulletin items - in real implementation, these would come from a context or API
  const bulletinItems: BulletinItem[] = [
    {
      id: '1',
      type: 'status',
      title: 'Mission Status',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
      severity: 'low'
    },
    {
      id: '2',
      type: 'alert',
      title: 'Weather Alert',
      message: 'High winds detected in sector 7',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      severity: 'medium'
    },
    {
      id: '3',
      type: 'health',
      title: 'Drone Health',
      message: 'Alpha-1 battery at 20%',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      severity: 'high'
    }
  ];

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'status':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'health':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (isCollapsed) {
    return (
      <div className={`bg-white border-r border-gray-200 flex flex-col items-center py-4 ${className}`}>
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Expand bulletin panel"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col h-full w-80 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">System Bulletin</h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Collapse bulletin panel"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Fleet Summary */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Fleet Status</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-gray-500">Total</div>
            <div className="font-semibold text-gray-900">{fleetStats.total}</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-green-600">Available</div>
            <div className="font-semibold text-green-900">{fleetStats.available}</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <div className="text-yellow-600">In Mission</div>
            <div className="font-semibold text-yellow-900">{fleetStats.inMission}</div>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <div className="text-red-600">Maintenance</div>
            <div className="font-semibold text-red-900">{fleetStats.maintenance}</div>
          </div>
        </div>
      </div>

      {/* Bulletin Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Updates</h3>
          <div className="space-y-3">
            {bulletinItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border ${getSeverityColor(item.severity)} cursor-pointer hover:shadow-sm transition-shadow`}
                onClick={() => {
                  // Handle item click - could open details or take action
                  // TODO: Implement bulletin item click handler
                }}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{item.title}</h4>
                      <span className="text-xs opacity-75">{formatTimestamp(item.timestamp)}</span>
                    </div>
                    <p className="text-sm mt-1 opacity-90">{item.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
