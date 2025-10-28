/**
 * Mock data for development and testing
 */

import type { Drone, DroneStatus } from '../types';
import type { Mission, MissionStatus } from '../types/mission';

export const mockDrones: Drone[] = [
  {
    id: 'drone-001',
    name: 'Alpha-1',
    model: 'DJI Mavic 3',
    status: 'available' as DroneStatus,
    capabilities: {
      payloadCapacity: 900,
      batteryCapacity: 5000,
      sensors: ['Camera', 'GPS', 'IMU', 'Obstacle Avoidance']
    },
    registeredAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'drone-002',
    name: 'Beta-2b',
    model: 'Autel EVO II Pro',
    status: 'in-mission' as DroneStatus,
    capabilities: {
      payloadCapacity: 1200,
      batteryCapacity: 7100,
      sensors: ['Camera', 'GPS', 'IMU', 'Thermal Camera']
    },
    registeredAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: 'drone-003',
    name: 'Gamma-3',
    model: 'Parrot Anafi',
    status: 'maintenance' as DroneStatus,
    capabilities: {
      payloadCapacity: 320,
      batteryCapacity: 2700,
      sensors: ['Camera', 'GPS', 'IMU']
    },
    registeredAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-18T11:30:00Z'
  },
  {
    id: 'drone-004',
    name: 'Delta-4',
    model: 'Skydio 2+',
    status: 'offline' as DroneStatus,
    capabilities: {
      payloadCapacity: 775,
      batteryCapacity: 3500,
      sensors: ['Camera', 'GPS', 'IMU', 'Obstacle Avoidance', 'Computer Vision']
    },
    registeredAt: '2024-01-12T08:15:00Z',
    updatedAt: '2024-01-19T13:45:00Z'
  }
];

export const mockMissions: Mission[] = [
  {
    id: 'mission-001',
    name: 'Perimeter Security Check',
    description: 'Routine security patrol around the facility perimeter',
    status: 'planned' as MissionStatus,
    waypoints: [
      {
        id: 'waypoint-001-1',
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194,
          altitude: 50
        },
        sequence: 1
      },
      {
        id: 'waypoint-001-2',
        coordinates: {
          latitude: 37.7759,
          longitude: -122.4204,
          altitude: 50
        },
        sequence: 2
      },
      {
        id: 'waypoint-001-3',
        coordinates: {
          latitude: 37.7769,
          longitude: -122.4214,
          altitude: 50
        },
        sequence: 3
      },
      {
        id: 'waypoint-001-4',
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194,
          altitude: 50
        },
        sequence: 4
      }
    ],
    assignedDroneId: undefined,
    priority: 7,
    estimatedDuration: 1800, // 30 minutes
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z',
    metadata: {
      facility: 'Main Campus',
      securityLevel: 'Standard'
    }
  },
  {
    id: 'mission-002',
    name: 'Infrastructure Inspection',
    description: 'Detailed inspection of building structures and utilities',
    status: 'active' as MissionStatus,
    waypoints: [
      {
        id: 'waypoint-002-1',
        coordinates: {
          latitude: 37.7849,
          longitude: -122.4094,
          altitude: 30
        },
        sequence: 1
      },
      {
        id: 'waypoint-002-2',
        coordinates: {
          latitude: 37.7859,
          longitude: -122.4104,
          altitude: 30
        },
        sequence: 2
      },
      {
        id: 'waypoint-002-3',
        coordinates: {
          latitude: 37.7869,
          longitude: -122.4114,
          altitude: 30
        },
        sequence: 3
      }
    ],
    assignedDroneId: 'drone-002',
    priority: 9,
    estimatedDuration: 2400, // 40 minutes
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    startedAt: '2024-01-20T09:15:00Z',
    metadata: {
      building: 'Administration Building',
      inspectionType: 'Structural'
    }
  },
  {
    id: 'mission-003',
    name: 'Emergency Response Drill',
    description: 'Simulated emergency response and evacuation route verification',
    status: 'completed' as MissionStatus,
    waypoints: [
      {
        id: 'waypoint-003-1',
        coordinates: {
          latitude: 37.7649,
          longitude: -122.4294,
          altitude: 40
        },
        sequence: 1
      },
      {
        id: 'waypoint-003-2',
        coordinates: {
          latitude: 37.7659,
          longitude: -122.4304,
          altitude: 40
        },
        sequence: 2
      },
      {
        id: 'waypoint-003-3',
        coordinates: {
          latitude: 37.7669,
          longitude: -122.4314,
          altitude: 40
        },
        sequence: 3
      },
      {
        id: 'waypoint-003-4',
        coordinates: {
          latitude: 37.7679,
          longitude: -122.4324,
          altitude: 40
        },
        sequence: 4
      },
      {
        id: 'waypoint-003-5',
        coordinates: {
          latitude: 37.7689,
          longitude: -122.4334,
          altitude: 40
        },
        sequence: 5
      }
    ],
    assignedDroneId: undefined,
    priority: 8,
    estimatedDuration: 2100, // 35 minutes
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
    startedAt: '2024-01-18T10:30:00Z',
    completedAt: '2024-01-18T11:30:00Z',
    metadata: {
      drillType: 'Evacuation Route',
      participants: 150,
      duration: 'Actual: 60 minutes'
    }
  },
  {
    id: 'mission-004',
    name: 'Environmental Monitoring',
    description: 'Air quality and environmental data collection',
    status: 'failed' as MissionStatus,
    waypoints: [
      {
        id: 'waypoint-004-1',
        coordinates: {
          latitude: 37.7549,
          longitude: -122.4394,
          altitude: 60
        },
        sequence: 1
      },
      {
        id: 'waypoint-004-2',
        coordinates: {
          latitude: 37.7559,
          longitude: -122.4404,
          altitude: 60
        },
        sequence: 2
      }
    ],
    assignedDroneId: undefined,
    priority: 6,
    estimatedDuration: 1200, // 20 minutes
    createdAt: '2024-01-17T16:00:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
    startedAt: '2024-01-17T16:15:00Z',
    completedAt: '2024-01-17T16:45:00Z',
    metadata: {
      failureReason: 'Sensor malfunction',
      retryScheduled: '2024-01-21T10:00:00Z'
    }
  },
  {
    id: 'mission-005',
    name: 'Delivery Test Run',
    description: 'Testing autonomous delivery capabilities',
    status: 'cancelled' as MissionStatus,
    waypoints: [
      {
        id: 'waypoint-005-1',
        coordinates: {
          latitude: 37.7449,
          longitude: -122.4494,
          altitude: 20
        },
        sequence: 1
      },
      {
        id: 'waypoint-005-2',
        coordinates: {
          latitude: 37.7459,
          longitude: -122.4504,
          altitude: 20
        },
        sequence: 2
      }
    ],
    assignedDroneId: undefined,
    priority: 4,
    estimatedDuration: 900, // 15 minutes
    createdAt: '2024-01-16T13:00:00Z',
    updatedAt: '2024-01-16T13:30:00Z',
    metadata: {
      cancellationReason: 'Weather conditions',
      rescheduledFor: '2024-01-22T14:00:00Z'
    }
  },
  {
    id: 'mission-006',
    name: 'High Priority Surveillance',
    description: 'Critical security surveillance mission',
    status: 'planned' as MissionStatus,
    waypoints: [
      {
        id: 'waypoint-006-1',
        coordinates: {
          latitude: 37.7349,
          longitude: -122.4594,
          altitude: 80
        },
        sequence: 1
      },
      {
        id: 'waypoint-006-2',
        coordinates: {
          latitude: 37.7359,
          longitude: -122.4604,
          altitude: 80
        },
        sequence: 2
      },
      {
        id: 'waypoint-006-3',
        coordinates: {
          latitude: 37.7369,
          longitude: -122.4614,
          altitude: 80
        },
        sequence: 3
      }
    ],
    assignedDroneId: undefined,
    priority: 10,
    estimatedDuration: 2700, // 45 minutes
    createdAt: '2024-01-21T07:00:00Z',
    updatedAt: '2024-01-21T07:00:00Z',
    metadata: {
      securityLevel: 'High',
      clearanceRequired: true,
      supervisor: 'John Smith'
    }
  }
];

export const commonDroneModels = [
  'DJI Mavic 3',
  'DJI Mavic Air 2',
  'DJI Phantom 4 Pro',
  'Autel EVO II Pro',
  'Parrot Anafi',
  'Skydio 2+',
  'Yuneec Typhoon H Pro',
  'Custom Build'
];

export const commonSensors = [
  'Camera',
  'GPS',
  'IMU',
  'Obstacle Avoidance',
  'Thermal Camera',
  'LiDAR',
  'Computer Vision',
  'Barometer',
  'Magnetometer'
];

export const commonMissionTypes = [
  'Security Patrol',
  'Infrastructure Inspection',
  'Emergency Response',
  'Environmental Monitoring',
  'Delivery',
  'Surveillance',
  'Search and Rescue',
  'Mapping',
  'Custom'
];

export const missionPriorities = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Low' },
  { value: 4, label: 'Medium' },
  { value: 5, label: 'Medium' },
  { value: 6, label: 'Medium' },
  { value: 7, label: 'High' },
  { value: 8, label: 'High' },
  { value: 9, label: 'Critical' },
  { value: 10, label: 'Critical' }
];
