/**
 * FleetStatusWidget Component
 * 
 * Displays status of all drones in the fleet
 */

import { useFleet } from '../../contexts/FleetContext.tsx';
import type { Drone } from '../../types';

export function FleetStatusWidget() {
  const { state } = useFleet();

  // Mock telemetry data for each drone - in real implementation, this would come from WebSocket or API
  const getTelemetryData = (drone: Drone) => {
    // Use drone ID as seed for consistent mock data per drone
    const seed = drone.id.split('-').pop() || '0';
    const seedNum = parseInt(seed) || 0;
    return {
      battery: (seedNum * 7 + 50) % 100, // Pseudo-random but consistent per drone
      gps: `${((seedNum * 13 + 37) % 180 - 90).toFixed(6)}, ${((seedNum * 17 + 73) % 360 - 180).toFixed(6)}`
    };
  };

  const getStatusColor = (status: Drone['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'in-mission':
        return 'bg-yellow-500';
      case 'maintenance':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-green-600';
    if (battery > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusLabel = (status: Drone['status']) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (state.drones.length === 0) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-sm">No drones available</p>
          <p className="text-xs mt-1">Add drones to see fleet status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 h-full overflow-y-auto">
      <div className="space-y-2">
        {state.drones.map((drone) => {
          const telemetry = getTelemetryData(drone);
          return (
            <div
              key={drone.id}
              className="bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              {/* Drone Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{drone.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{drone.model}</p>
                </div>
                {/* Status Indicator */}
                <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(drone.status)}`}></div>
                  <span className="text-xs text-gray-600 capitalize whitespace-nowrap">
                    {getStatusLabel(drone.status)}
                  </span>
                </div>
              </div>

              {/* Battery and GPS */}
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">Battery</div>
                  <div className={`font-semibold ${getBatteryColor(telemetry.battery)}`}>
                    {telemetry.battery}%
                  </div>
                </div>
                <div className="bg-white p-2 rounded">
                  <div className="text-gray-500">GPS</div>
                  <div className="text-gray-900 font-mono text-xs truncate" title={telemetry.gps}>
                    {telemetry.gps}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

