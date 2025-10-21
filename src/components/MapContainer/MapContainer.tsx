/**
 * MapContainer Component
 * 
 * MapLibre GL map integration with controls and drone markers
 */

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapContainerProps {
  className?: string;
}

export function MapContainer({ className = '' }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/hybrid/style.json?key=kSVQtZ7ooA4Sxv379Qgq',
      center: [121.4248, 25.1794], // Default center
      zoom: 9,
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
