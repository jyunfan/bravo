/**
 * Mission Management Types
 * 
 * TypeScript interfaces for mission planning, waypoints, and execution
 */

export type MissionStatus = 'planned' | 'active' | 'completed' | 'failed' | 'cancelled';

export interface Waypoint {
  /** Unique identifier for the waypoint */
  id: string;
  /** Geographic coordinates */
  coordinates: {
    /** Latitude in decimal degrees */
    latitude: number;
    /** Longitude in decimal degrees */
    longitude: number;
    /** Altitude in meters above ground level */
    altitude: number;
  };
  /** Order in the mission sequence */
  sequence: number;
}

export interface WaypointAction {
  /** Type of action to perform */
  type: 'photo' | 'video' | 'sensor-reading' | 'payload-drop' | 'hover' | 'custom';
  /** Duration of action in seconds */
  duration?: number;
  /** Additional parameters for the action */
  parameters?: Record<string, any>;
  /** Custom action description for 'custom' type */
  description?: string;
}

export interface Mission {
  /** Unique identifier for the mission */
  id: string;
  /** Human-readable name for the mission */
  name: string;
  /** Description of the mission */
  description?: string;
  /** Current status of the mission */
  status: MissionStatus;
  /** Array of waypoints defining the mission path */
  waypoints: Waypoint[];
  /** ID of the drone assigned to this mission */
  assignedDroneId?: string;
  /** Mission priority (1-10, higher is more urgent) */
  priority: number;
  /** Estimated total duration in seconds */
  estimatedDuration?: number;
  /** Mission creation timestamp */
  createdAt: string;
  /** Last updated timestamp */
  updatedAt: string;
  /** Mission start timestamp */
  startedAt?: string;
  /** Mission completion timestamp */
  completedAt?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

export interface MissionCreationData {
  /** Mission name */
  name: string;
  /** Mission description */
  description?: string;
  /** Array of waypoints */
  waypoints: Omit<Waypoint, 'id'>[];
  /** Mission priority */
  priority: number;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

export interface MissionUpdateData {
  /** Updated name */
  name?: string;
  /** Updated description */
  description?: string;
  /** Updated waypoints */
  waypoints?: Omit<Waypoint, 'id'>[];
  /** Updated priority */
  priority?: number;
  /** Updated metadata */
  metadata?: Record<string, any>;
}

export interface MissionAssignment {
  /** Mission ID */
  missionId: string;
  /** Drone ID to assign */
  droneId: string;
  /** Assignment timestamp */
  assignedAt: string;
}

export interface MissionProgress {
  /** Mission ID */
  missionId: string;
  /** Current waypoint index */
  currentWaypointIndex: number;
  /** Progress percentage (0-100) */
  progressPercentage: number;
  /** Estimated time remaining in seconds */
  estimatedTimeRemaining?: number;
  /** Last updated timestamp */
  updatedAt: string;
}

// Utility types for form handling
export type MissionFormData = Omit<MissionCreationData, 'waypoints'> & {
  waypoints: Partial<Omit<Waypoint, 'id'>>[];
};

// Filter and search types
export interface MissionFilters {
  status?: MissionStatus[];
  assignedDroneId?: string[];
  priority?: number[];
  searchTerm?: string;
}

export interface MissionStats {
  total: number;
  planned: number;
  active: number;
  completed: number;
  failed: number;
  cancelled: number;
}
