/**
 * Drone Fleet Management Types
 * 
 * TypeScript interfaces for drone data models and fleet management
 */

import type { Mission } from './mission';

export type DroneStatus = 'available' | 'in-mission' | 'maintenance' | 'offline';

export interface DroneCapabilities {
  /** Maximum payload capacity in grams */
  payloadCapacity: number;
  /** Battery capacity in mAh */
  batteryCapacity: number;
  /** Available sensors */
  sensors: string[];
}

export interface Drone {
  /** Unique identifier for the drone */
  id: string;
  /** Human-readable name for the drone */
  name: string;
  /** Drone model/manufacturer */
  model: string;
  /** Current operational status */
  status: DroneStatus;
  /** Drone capabilities and specifications */
  capabilities: DroneCapabilities;
  /** ID of the currently assigned mission */
  currentMissionId?: string;
  /** Timestamp when drone was registered */
  registeredAt: string;
  /** Last updated timestamp */
  updatedAt: string;
}

export interface FleetState {
  /** Array of all registered drones */
  drones: Drone[];
  /** Array of all missions */
  missions: Mission[];
  /** Currently selected drone for configuration */
  selectedDroneId: string | null;
  /** Currently selected mission for configuration */
  selectedMissionId: string | null;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

export interface DroneRegistrationData {
  /** Drone name */
  name: string;
  /** Drone model */
  model: string;
  /** Initial capabilities */
  capabilities: DroneCapabilities;
}

export interface DroneUpdateData {
  /** Updated name */
  name?: string;
  /** Updated model */
  model?: string;
  /** Updated capabilities */
  capabilities?: Partial<DroneCapabilities>;
}

// Utility types for form handling
export type DroneFormData = Omit<DroneRegistrationData, 'capabilities'> & {
  capabilities: Partial<DroneCapabilities>;
};

// Filter and search types
export interface FleetFilters {
  status?: DroneStatus[];
  model?: string[];
  searchTerm?: string;
}

export interface FleetStats {
  total: number;
  available: number;
  inMission: number;
  maintenance: number;
  offline: number;
  // Mission statistics
  missions: {
    total: number;
    planned: number;
    active: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
}
