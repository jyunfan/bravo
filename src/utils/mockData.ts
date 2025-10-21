/**
 * Mock data for development and testing
 */

import type { Drone, DroneStatus } from '../types';

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
    name: 'Beta-2',
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
