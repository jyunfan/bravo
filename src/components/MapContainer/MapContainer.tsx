/**
 * MapContainer Component
 * 
 * MapLibre GL map integration with controls, drone markers, and mission waypoints
 */

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MapboxOverlay} from '@deck.gl/mapbox';
import {ScatterplotLayer, LineLayer, TextLayer} from '@deck.gl/layers';
import { mockMissions } from '../../utils/mockData';
import { processMissionsForVisualization } from '../../utils/missionUtils';

interface MapContainerProps {
  className?: string;
}

export function MapContainer({ className = '' }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Process mission data for visualization
  const { waypointData, lineData, textData } = processMissionsForVisualization(mockMissions);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      //style: 'https://demotiles.maplibre.org/style.json',
      //style: 'https://api.maptiler.com/maps/hybrid/style.json?key=kSVQtZ7ooA4Sxv379Qgq',
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [121.4248, 25.1794], // Default center
      zoom: 11,
      attributionControl: false
    });


    // Handle map load
    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      // Add navigation controls after map loads
      if (map.current) {
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        
        // Add fullscreen control with different positioning to avoid overlap
        //map.current.addControl(new maplibregl.FullscreenControl(), 'top-left');

        const deckOverlay = new MapboxOverlay({
            interleaved: true,
            layers: [
              // Mission waypoint lines (paths)
              new LineLayer({
                id: 'mission-lines',
                data: lineData,
                getSourcePosition: d => d.sourcePosition,
                getTargetPosition: d => d.targetPosition,
                getColor: d => d.color,
                getWidth: d => d.width,
                widthUnits: 'pixels', // Fixed width in pixels regardless of zoom
                pickable: true,
                beforeId: 'watername_ocean'
              }),
              // Mission waypoints (circles)
              new ScatterplotLayer({
                id: 'mission-waypoints',
                data: waypointData,
                getPosition: d => d.position,
                getFillColor: d => d.color,
                getRadius: d => d.radius,
                radiusUnits: 'pixels', // Fixed radius in pixels regardless of zoom
                pickable: true,
                beforeId: 'watername_ocean'
              }),
              // Waypoint sequence numbers
              new TextLayer({
                id: 'waypoint-labels',
                data: textData,
                getPosition: d => d.position,
                getText: d => d.text,
                getColor: d => d.color,
                getSize: d => d.size,
                sizeUnits: 'pixels', // Fixed size in pixels regardless of zoom
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                beforeId: 'watername_ocean'
              }),
              // Original test circle (keeping for reference)
              /*
              new ScatterplotLayer({
                id: 'deckgl-circle',
                data: [
                  {position: [121.4248, 25.1794]}
                ],
                getPosition: d => d.position,
                getFillColor: [255, 0, 0, 100],
                getRadius: 1000,
                beforeId: 'watername_ocean'
              })
                */
            ]
          });
          
          map.current.addControl(deckOverlay);
      }
      
      // Trigger resize after map loads to ensure proper dimensions
      setTimeout(() => {
        if (map.current) {
          map.current.resize();
        }
      }, 100);
    });

    // Handle map resize
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add drone markers when map is loaded and drones are available
  return (
    <div className={`w-full h-full ${className}`} style={{ height: '100vh' }}>
      <div ref={mapContainer} className="w-full h-full" style={{ height: '100%' }} />
      
      {/* Mission Status Legend */}
      {isMapLoaded && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Mission Status</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(0, 123, 255)' }}></div>
              <span className="text-gray-700">Planned</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(40, 167, 69)' }}></div>
              <span className="text-gray-700">Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(108, 117, 125)' }}></div>
              <span className="text-gray-700">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(220, 53, 69)' }}></div>
              <span className="text-gray-700">Failed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(255, 193, 7)' }}></div>
              <span className="text-gray-700">Cancelled</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Click on waypoints to view mission details. Numbers show waypoint sequence.
            </p>
          </div>
        </div>
      )}
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

    </div>
  );
}
