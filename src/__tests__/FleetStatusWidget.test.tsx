/**
 * FleetStatusWidget Tests
 * 
 * Tests for the FleetStatusWidget component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FleetStatusWidget } from '../components/widgets/FleetStatusWidget';
import { FleetProvider } from '../contexts/FleetContext';
import type { Drone } from '../types';
import { mockDrones } from '../utils/mockData';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('FleetStatusWidget', () => {
  beforeEach(() => {
    localStorage.clear();
    // Set up mock drones in localStorage
    localStorage.setItem('drone-fleet', JSON.stringify(mockDrones));
  });

  const renderWithProvider = () => {
    return render(
      <FleetProvider>
        <FleetStatusWidget />
      </FleetProvider>
    );
  };

  describe('Displaying all drones in fleet', () => {
    it('should display all drones from the fleet', () => {
      renderWithProvider();
      
      // Wait for drones to load and check for drone names
      expect(screen.getByText('Alpha-1')).toBeInTheDocument();
      expect(screen.getByText('Beta-2b')).toBeInTheDocument();
      expect(screen.getByText('Gamma-3')).toBeInTheDocument();
    });

    it('should display drone name and model for each entry', () => {
      renderWithProvider();
      
      // Check for drone names
      expect(screen.getByText('Alpha-1')).toBeInTheDocument();
      expect(screen.getByText('DJI Mavic 3')).toBeInTheDocument();
      
      expect(screen.getByText('Beta-2b')).toBeInTheDocument();
      expect(screen.getByText('Autel EVO II Pro')).toBeInTheDocument();
    });

    it('should display status indicator with color coding for each drone', () => {
      renderWithProvider();
      
      // Check for status indicators (they have specific classes)
      const statusIndicators = document.querySelectorAll('.bg-green-500, .bg-yellow-500, .bg-red-500, .bg-gray-500');
      expect(statusIndicators.length).toBeGreaterThan(0);
    });

    it('should display battery level for each drone', () => {
      renderWithProvider();
      
      // Check for battery labels
      const batteryLabels = screen.getAllByText('Battery');
      expect(batteryLabels.length).toBeGreaterThan(0);
      
      // Check for battery percentage values
      const batteryValues = screen.getAllByText(/%/);
      expect(batteryValues.length).toBeGreaterThan(0);
    });

    it('should display geolocation (GPS) for each drone', () => {
      renderWithProvider();
      
      // Check for GPS labels
      const gpsLabels = screen.getAllByText('GPS');
      expect(gpsLabels.length).toBeGreaterThan(0);
      
      // Check for GPS coordinates (format: number, number)
      const gpsElements = document.querySelectorAll('[title*=","]');
      expect(gpsElements.length).toBeGreaterThan(0);
    });
  });

  describe('Status indicator color coding', () => {
    it('should display green indicator for available drones', () => {
      renderWithProvider();
      
      // Find available drone status indicator
      const availableDrone = screen.getByText('Alpha-1').closest('.bg-gray-50');
      expect(availableDrone).toBeInTheDocument();
      
      // Check for green status indicator
      const greenIndicator = availableDrone?.querySelector('.bg-green-500');
      expect(greenIndicator).toBeInTheDocument();
    });

    it('should display yellow indicator for in-mission drones', () => {
      renderWithProvider();
      
      // Find in-mission drone
      const inMissionDrone = screen.getByText('Beta-2b').closest('.bg-gray-50');
      expect(inMissionDrone).toBeInTheDocument();
      
      // Check for yellow status indicator
      const yellowIndicator = inMissionDrone?.querySelector('.bg-yellow-500');
      expect(yellowIndicator).toBeInTheDocument();
    });

    it('should display red indicator for maintenance drones', () => {
      renderWithProvider();
      
      // Find maintenance drone
      const maintenanceDrone = screen.getByText('Gamma-3').closest('.bg-gray-50');
      expect(maintenanceDrone).toBeInTheDocument();
      
      // Check for red status indicator
      const redIndicator = maintenanceDrone?.querySelector('.bg-red-500');
      expect(redIndicator).toBeInTheDocument();
    });

    it('should display gray indicator for offline drones', () => {
      // Create a drone with offline status
      const offlineDrone: Drone = {
        id: 'drone-offline',
        name: 'Offline-1',
        model: 'Test Model',
        status: 'offline',
        capabilities: {
          payloadCapacity: 500,
          batteryCapacity: 3000,
          sensors: ['GPS'],
        },
        registeredAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      
      localStorage.setItem('drone-fleet', JSON.stringify([offlineDrone]));
      
      renderWithProvider();
      
      // Find offline drone
      const offlineDroneElement = screen.getByText('Offline-1').closest('.bg-gray-50');
      expect(offlineDroneElement).toBeInTheDocument();
      
      // Check for gray status indicator
      const grayIndicator = offlineDroneElement?.querySelector('.bg-gray-500');
      expect(grayIndicator).toBeInTheDocument();
    });
  });

  describe('Empty fleet handling', () => {
    it('should display appropriate message when fleet has no drones', () => {
      localStorage.setItem('drone-fleet', JSON.stringify([]));
      
      renderWithProvider();
      
      expect(screen.getByText('No drones available')).toBeInTheDocument();
      expect(screen.getByText('Add drones to see fleet status')).toBeInTheDocument();
    });

    it('should not crash when fleet is empty', () => {
      localStorage.setItem('drone-fleet', JSON.stringify([]));
      
      expect(() => {
        renderWithProvider();
      }).not.toThrow();
    });
  });

  describe('Large fleet scrolling', () => {
    it('should make widget content scrollable when fleet exceeds widget height', () => {
      // Create a large fleet
      const largeFleet: Drone[] = Array.from({ length: 20 }, (_, i) => ({
        id: `drone-${i}`,
        name: `Drone-${i}`,
        model: `Model-${i}`,
        status: 'available' as const,
        capabilities: {
          payloadCapacity: 500,
          batteryCapacity: 3000,
          sensors: ['GPS'],
        },
        registeredAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }));
      
      localStorage.setItem('drone-fleet', JSON.stringify(largeFleet));
      
      renderWithProvider();
      
      // Check that the container has overflow-y-auto class for scrolling
      const container = document.querySelector('.overflow-y-auto');
      expect(container).toBeInTheDocument();
    });

    it('should display all drones even in large fleet', () => {
      // Create a large fleet
      const largeFleet: Drone[] = Array.from({ length: 10 }, (_, i) => ({
        id: `drone-${i}`,
        name: `Drone-${i}`,
        model: `Model-${i}`,
        status: 'available' as const,
        capabilities: {
          payloadCapacity: 500,
          batteryCapacity: 3000,
          sensors: ['GPS'],
        },
        registeredAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }));
      
      localStorage.setItem('drone-fleet', JSON.stringify(largeFleet));
      
      renderWithProvider();
      
      // Check that all drones are rendered
      expect(screen.getByText('Drone-0')).toBeInTheDocument();
      expect(screen.getByText('Drone-5')).toBeInTheDocument();
      expect(screen.getByText('Drone-9')).toBeInTheDocument();
    });
  });
});

