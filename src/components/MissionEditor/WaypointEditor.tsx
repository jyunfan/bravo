/**
 * Waypoint Editor Component
 * 
 * Panel for editing individual waypoint properties (altitude, sequence)
 */

import { useState, useEffect } from 'react';
import type { Waypoint } from '../../types/mission';
import { COORDINATE_BOUNDS } from '../../utils/missionUtils';

interface WaypointEditorProps {
  waypoint: Waypoint | null;
  onSave: (waypoint: Waypoint) => void;
  onDelete: (waypointId: string) => void;
  onClose: () => void;
}

export function WaypointEditor({ waypoint, onSave, onDelete, onClose }: WaypointEditorProps) {
  const [altitude, setAltitude] = useState<number>(50);
  const [sequence, setSequence] = useState<number>(1);
  const [altitudeError, setAltitudeError] = useState<string | null>(null);
  const [sequenceError, setSequenceError] = useState<string | null>(null);

  useEffect(() => {
    if (waypoint) {
      setAltitude(waypoint.coordinates.altitude);
      setSequence(waypoint.sequence);
      setAltitudeError(null);
      setSequenceError(null);
    }
  }, [waypoint]);

  if (!waypoint) return null;

  const validateAltitude = (value: number): boolean => {
    if (value < COORDINATE_BOUNDS.altitude.min || value > COORDINATE_BOUNDS.altitude.max) {
      setAltitudeError(`Altitude must be between ${COORDINATE_BOUNDS.altitude.min} and ${COORDINATE_BOUNDS.altitude.max} meters`);
      return false;
    }
    setAltitudeError(null);
    return true;
  };

  const validateSequence = (value: number): boolean => {
    if (value < 1 || !Number.isInteger(value)) {
      setSequenceError('Sequence must be a positive integer');
      return false;
    }
    setSequenceError(null);
    return true;
  };

  const handleSave = () => {
    if (!validateAltitude(altitude) || !validateSequence(sequence)) {
      return;
    }

    const updatedWaypoint: Waypoint = {
      ...waypoint,
      coordinates: {
        ...waypoint.coordinates,
        altitude
      },
      sequence
    };

    onSave(updatedWaypoint);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this waypoint?')) {
      onDelete(waypoint.id);
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 w-80 z-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Edit Waypoint</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coordinates
          </label>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Lat: {waypoint.coordinates.latitude.toFixed(6)}</div>
            <div>Lng: {waypoint.coordinates.longitude.toFixed(6)}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Altitude (meters)
          </label>
          <input
            type="number"
            min={COORDINATE_BOUNDS.altitude.min}
            max={COORDINATE_BOUNDS.altitude.max}
            value={altitude}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setAltitude(value);
              validateAltitude(value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {altitudeError && (
            <p className="text-xs text-red-600 mt-1">{altitudeError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sequence
          </label>
          <input
            type="number"
            min={1}
            value={sequence}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setSequence(value);
              validateSequence(value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {sequenceError && (
            <p className="text-xs text-red-600 mt-1">{sequenceError}</p>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

