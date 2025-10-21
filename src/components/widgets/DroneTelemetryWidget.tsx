/**
 * DroneTelemetryWidget Component
 * 
 * Displays real-time drone telemetry data
 */

import type { Drone } from '../../types';

interface DroneTelemetryWidgetProps {
  drone?: Drone;
}

export function DroneTelemetryWidget({ drone }: DroneTelemetryWidgetProps) {
  // Mock telemetry data - in real implementation, this would come from WebSocket or API
  const telemetryData = {
    altitude: drone ? Math.floor(Math.random() * 500) : 0,
    speed: drone ? Math.floor(Math.random() * 20) : 0,
    battery: drone ? Math.floor(Math.random() * 100) : 0,
    signal: drone ? Math.floor(Math.random() * 100) : 0,
    temperature: drone ? Math.floor(Math.random() * 40) + 10 : 0,
    gps: drone ? `${(Math.random() * 180 - 90).toFixed(6)}, ${(Math.random() * 360 - 180).toFixed(6)}` : '0.000000, 0.000000'
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-green-600';
    if (battery > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSignalColor = (signal: number) => {
    if (signal > 70) return 'text-green-600';
    if (signal > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-3 h-full">
      <div className="space-y-3">
        {/* Drone Info */}
        {drone && (
          <div className="text-center pb-2 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">{drone.name}</h4>
            <p className="text-xs text-gray-500">{drone.model}</p>
          </div>
        )}

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-gray-500">Altitude</div>
            <div className="font-semibold text-gray-900">{telemetryData.altitude}m</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-gray-500">Speed</div>
            <div className="font-semibold text-gray-900">{telemetryData.speed}m/s</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-gray-500">Battery</div>
            <div className={`font-semibold ${getBatteryColor(telemetryData.battery)}`}>
              {telemetryData.battery}%
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-gray-500">Signal</div>
            <div className={`font-semibold ${getSignalColor(telemetryData.signal)}`}>
              {telemetryData.signal}%
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between bg-gray-50 p-2 rounded">
            <span className="text-gray-500">GPS:</span>
            <span className="text-gray-900 font-mono text-xs">{telemetryData.gps}</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              drone?.status === 'available' ? 'bg-green-500' :
              drone?.status === 'in-mission' ? 'bg-yellow-500' :
              drone?.status === 'maintenance' ? 'bg-red-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-xs text-gray-600 capitalize">
              {drone?.status || 'No drone selected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
