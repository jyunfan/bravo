/**
 * Mission Management Utilities
 * 
 * Validation, calculation, and utility functions for mission management
 */

import type { Mission, MissionCreationData, Waypoint, WaypointAction, MissionStatus } from '../types/mission';

/**
 * Validation error types
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Coordinate bounds for validation
 */
export const COORDINATE_BOUNDS = {
  latitude: { min: -90, max: 90 },
  longitude: { min: -180, max: 180 },
  altitude: { min: 0, max: 10000 }, // meters above ground level
} as const;

/**
 * Mission constraints
 */
export const MISSION_CONSTRAINTS = {
  maxWaypoints: 50,
  minWaypoints: 1,
  maxPriority: 10,
  minPriority: 1,
  maxNameLength: 100,
  maxDescriptionLength: 500,
} as const;

/**
 * Validates mission creation data
 */
export function validateMissionCreation(data: MissionCreationData): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate mission name
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Mission name is required',
      code: 'MISSING_NAME'
    });
  } else if (data.name.length > MISSION_CONSTRAINTS.maxNameLength) {
    errors.push({
      field: 'name',
      message: `Mission name must be ${MISSION_CONSTRAINTS.maxNameLength} characters or less`,
      code: 'NAME_TOO_LONG'
    });
  }

  // Validate description length
  if (data.description && data.description.length > MISSION_CONSTRAINTS.maxDescriptionLength) {
    errors.push({
      field: 'description',
      message: `Description must be ${MISSION_CONSTRAINTS.maxDescriptionLength} characters or less`,
      code: 'DESCRIPTION_TOO_LONG'
    });
  }

  // Validate priority
  if (data.priority < MISSION_CONSTRAINTS.minPriority || data.priority > MISSION_CONSTRAINTS.maxPriority) {
    errors.push({
      field: 'priority',
      message: `Priority must be between ${MISSION_CONSTRAINTS.minPriority} and ${MISSION_CONSTRAINTS.maxPriority}`,
      code: 'INVALID_PRIORITY'
    });
  }

  // Validate waypoints
  const waypointValidation = validateWaypoints(data.waypoints);
  if (!waypointValidation.isValid) {
    errors.push(...waypointValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates waypoints array
 */
export function validateWaypoints(waypoints: Omit<Waypoint, 'id'>[]): ValidationResult {
  const errors: ValidationError[] = [];

  // Check waypoint count
  if (waypoints.length < MISSION_CONSTRAINTS.minWaypoints) {
    errors.push({
      field: 'waypoints',
      message: `Mission must have at least ${MISSION_CONSTRAINTS.minWaypoints} waypoint`,
      code: 'TOO_FEW_WAYPOINTS'
    });
  }

  if (waypoints.length > MISSION_CONSTRAINTS.maxWaypoints) {
    errors.push({
      field: 'waypoints',
      message: `Mission cannot have more than ${MISSION_CONSTRAINTS.maxWaypoints} waypoints`,
      code: 'TOO_MANY_WAYPOINTS'
    });
  }

  // Validate each waypoint
  waypoints.forEach((waypoint, index) => {
    const waypointErrors = validateWaypoint(waypoint, index);
    if (!waypointErrors.isValid) {
      errors.push(...waypointErrors.errors);
    }
  });

  // Check for duplicate sequences
  const sequences = waypoints.map(w => w.sequence);
  const uniqueSequences = new Set(sequences);
  if (sequences.length !== uniqueSequences.size) {
    errors.push({
      field: 'waypoints',
      message: 'Waypoint sequences must be unique',
      code: 'DUPLICATE_SEQUENCES'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a single waypoint
 */
export function validateWaypoint(waypoint: Omit<Waypoint, 'id'>, index: number): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate coordinates
  const coordErrors = validateCoordinates(waypoint.coordinates, index);
  if (!coordErrors.isValid) {
    errors.push(...coordErrors.errors);
  }

  // Validate sequence
  if (waypoint.sequence < 0) {
    errors.push({
      field: `waypoints[${index}].sequence`,
      message: 'Waypoint sequence must be non-negative',
      code: 'INVALID_SEQUENCE'
    });
  }

  // Validate action if present
  // Note: Action validation removed as action field was removed from Waypoint interface

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates coordinates
 */
export function validateCoordinates(
  coordinates: { latitude: number; longitude: number; altitude: number },
  waypointIndex: number
): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate latitude
  if (coordinates.latitude < COORDINATE_BOUNDS.latitude.min || 
      coordinates.latitude > COORDINATE_BOUNDS.latitude.max) {
    errors.push({
      field: `waypoints[${waypointIndex}].coordinates.latitude`,
      message: `Latitude must be between ${COORDINATE_BOUNDS.latitude.min} and ${COORDINATE_BOUNDS.latitude.max}`,
      code: 'INVALID_LATITUDE'
    });
  }

  // Validate longitude
  if (coordinates.longitude < COORDINATE_BOUNDS.longitude.min || 
      coordinates.longitude > COORDINATE_BOUNDS.longitude.max) {
    errors.push({
      field: `waypoints[${waypointIndex}].coordinates.longitude`,
      message: `Longitude must be between ${COORDINATE_BOUNDS.longitude.min} and ${COORDINATE_BOUNDS.longitude.max}`,
      code: 'INVALID_LONGITUDE'
    });
  }

  // Validate altitude
  if (coordinates.altitude < COORDINATE_BOUNDS.altitude.min || 
      coordinates.altitude > COORDINATE_BOUNDS.altitude.max) {
    errors.push({
      field: `waypoints[${waypointIndex}].coordinates.altitude`,
      message: `Altitude must be between ${COORDINATE_BOUNDS.altitude.min} and ${COORDINATE_BOUNDS.altitude.max} meters`,
      code: 'INVALID_ALTITUDE'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates waypoint action
 */
export function validateWaypointAction(action: WaypointAction, waypointIndex: number): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate action type
  const validActionTypes = ['photo', 'video', 'sensor-reading', 'payload-drop', 'hover', 'custom'];
  if (!validActionTypes.includes(action.type)) {
    errors.push({
      field: `waypoints[${waypointIndex}].action.type`,
      message: `Action type must be one of: ${validActionTypes.join(', ')}`,
      code: 'INVALID_ACTION_TYPE'
    });
  }

  // Validate duration
  if (action.duration !== undefined && action.duration < 0) {
    errors.push({
      field: `waypoints[${waypointIndex}].action.duration`,
      message: 'Action duration must be non-negative',
      code: 'INVALID_DURATION'
    });
  }

  // Validate custom action description
  if (action.type === 'custom' && (!action.description || action.description.trim().length === 0)) {
    errors.push({
      field: `waypoints[${waypointIndex}].action.description`,
      message: 'Custom action requires a description',
      code: 'MISSING_CUSTOM_DESCRIPTION'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculates the total distance of a mission in meters
 */
export function calculateMissionDistance(waypoints: Waypoint[]): number {
  if (waypoints.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const current = waypoints[i];
    const next = waypoints[i + 1];
    totalDistance += calculateDistanceBetweenPoints(
      current.coordinates,
      next.coordinates
    );
  }
  return totalDistance;
}

/**
 * Calculates distance between two coordinate points using Haversine formula
 */
export function calculateDistanceBetweenPoints(
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates estimated mission duration based on distance and actions
 */
export function calculateMissionDuration(waypoints: Waypoint[], averageSpeed: number = 10): number {
  if (waypoints.length < 2) return 0;

  // Calculate total distance
  const totalDistance = calculateMissionDistance(waypoints);
  
  // Calculate flight time (distance / speed)
  const flightTime = totalDistance / averageSpeed; // seconds
  
  // Calculate action time (removed as action field was removed from Waypoint interface)
  const actionTime = 0; // No actions supported in current waypoint structure
  
  // Add buffer time for takeoff/landing and transitions
  const bufferTime = 300; // 5 minutes
  
  return Math.round(flightTime + actionTime + bufferTime);
}

/**
 * Checks if a mission can be assigned to a drone
 */
export function canAssignMissionToDrone(mission: Mission): boolean {
  // Mission must be in planned status
  if (mission.status !== 'planned') {
    return false;
  }
  
  // Mission must not already be assigned
  if (mission.assignedDroneId) {
    return false;
  }
  
  // Additional checks could be added here (drone capabilities, etc.)
  return true;
}

/**
 * Generates a unique mission ID
 */
export function generateMissionId(): string {
  return `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a unique waypoint ID
 */
export function generateWaypointId(): string {
  return `waypoint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sorts waypoints by sequence
 */
export function sortWaypointsBySequence(waypoints: Waypoint[]): Waypoint[] {
  return [...waypoints].sort((a, b) => a.sequence - b.sequence);
}

/**
 * Gets the next waypoint in sequence
 */
export function getNextWaypoint(waypoints: Waypoint[], currentSequence: number): Waypoint | null {
  const sortedWaypoints = sortWaypointsBySequence(waypoints);
  return sortedWaypoints.find(w => w.sequence > currentSequence) || null;
}

/**
 * Checks if mission is in a terminal state
 */
export function isMissionTerminal(status: MissionStatus): boolean {
  return ['completed', 'failed', 'cancelled'].includes(status);
}

/**
 * Checks if mission can be modified
 */
export function canModifyMission(status: MissionStatus): boolean {
  return status === 'planned';
}
